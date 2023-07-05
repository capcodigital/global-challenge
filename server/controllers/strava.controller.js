/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var https = require("https");
var challenges = require('./challenges.controller');
var levels = require('./levels.controller');
var locations = require('./locations.controller');
var User = mongoose.model('User');
var Capco = mongoose.model('Capco');

var strava = require('strava-v3');
var cluster = require('cluster');
var fs = require('fs');
var config = require("../config/config");
var mailer = require('../services/mail.service');

var apiKey = process.env.STRAVA_API_KEY;
var secret = process.env.STRAVA_SECRET;
var client_id = process.env.STRAVA_CLIENT_ID;

if (!apiKey) apiKey = fs.readFileSync('./config/keys/strava_key.txt', 'utf8');
if (!secret) secret = fs.readFileSync('./config/keys/strava_secret.txt', 'utf8');
if (!client_id) client_id = fs.readFileSync('./config/keys/strava_client.txt', 'utf8');

var challengeDates = []; 
challenges.getCurrentChallengeDates(function(dates) {
    challengeDates = dates;
});

var headers = {
    "api-token" : apiKey
};

var authOptions = {
    hostname: "www.strava.com",
    method: 'POST',
    headers: headers,
    port: 443,
    agent: false
};

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';
const challengeName = process.env.CHALLENGE_NAME;
const CYCLING_CONVERSION = config.cyclingConversion || 3;

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    if (process.env.UPDATE_INTERVAL) {
        updateEveryInterval(process.env.UPDATE_INTERVAL);
    }
    else {
        updateEveryInterval(60);
    }
}

exports.authorize = function(req, res) {

    if (!req.query.code || req.query.error) {
        console.log("Could not authenticate with your Strava account");
        res.redirect(callbackUrl + 'register?success=stravaError');
    } else {
        var email = req.query.state.toLowerCase();
        var userOptions = authOptions;
        userOptions.path = "/oauth/token?client_id=" + client_id + "&client_secret=" + secret + "&code=" + req.query.code;

        var newReq = buildRequest(userOptions, function(err, result){
            if (err) {
                console.log("Request Error: " + err);
                res.redirect(callbackUrl + 'register?success=stravaError');
            } else if (result.errors && result.errors.length > 0) {
                console.log("Strava Error: " + JSON.stringify(result));
                console.log("Strava Errors: " + JSON.stringify(result.errors));
                res.redirect(callbackUrl + 'register?success=stravaError');
            } else {
                
                Capco.findOne({email: email.toLowerCase()}).exec(function(err, profile) {
                    if (err || !profile) {
                        res.json({error: "Could not find your Capco email [" + email + "]"});
                    } else {
                        var user = new User();

                        user.email = email.toLowerCase();
                        user.app = "Strava";
                        user.access_token = result.access_token;
                        user.refresh_token = result.refresh_token;

                        var date = new Date();
                        var datemillis = date.getTime();

                        var expiresTime = new Date(result.expires_in*1000);
                        var expiresTimeMillis = expiresTime.getTime();

                        var expiration = new Date();
                        expiration.setTime(datemillis + expiresTimeMillis);

                        user.expires_in = expiration;
                        user.expires_at = result.expires_at;
                        user.user_id = result.athlete.id;

                        user.name = profile.name;
                        user.location = profile.location;
                        user.level = profile.level;

                        if (profile.location === "New York RISC") {
                            user.location = "New York";
                        } else if (profile.location === "Washington DC Metro") {
                            user.location = "Washington DC";
                        } else if (profile.location === "Orlando RISC") {
                            user.location = "Orlando";
                        } else if (profile.location === "Antwerp") {
                            user.location = "Brussels";
                        } else if (profile.location === "Malaysia") {
                            user.location = "Kuala Lumpur";
                        } else {
                            user.location = profile.location;
                        }

                        user.activities = {};
                        user.totalSteps = 0;
                        user.totalCalories = 0;
                        user.totalDistance = 0;
                        user.totalDistanceConverted = 0;
                        user.totalDuration = 0;
                        user.totalWalk = 0;
                        user.totalRun = 0;
                        // user.totalSwim = 0;
                        user.totalCycling = 0;
                        user.totalCyclingConverted = 0;
                        // user.totalRowing = 0;
                        user.totalYoga = 0;

                        user.save(function(err, newUser) {
                            if (err) {
                                console.log(err.message);
                                if (err.code == 11000) {
                                    if (user.app === "FitBit") {
                                        res.redirect(callbackUrl + 'register?success=fitBitRegistered');
                                    } else {
                                        // Already registered but update the users access tokens anyway so we have the latest expiry
                                        updateAccessTokens(user);
                                        res.redirect(callbackUrl + 'register?success=stravaRegistered');
                                    }
                                } else {
                                    res.redirect(callbackUrl + 'register?success=serverError');
                                }
                            } else {
                                locations.AddOrUpdate(newUser.location, newUser._id);
                                levels.AddOrUpdate(newUser.level, newUser._id);

                                /*
                                let emailText = "Hello " + user.name + ",\n\r You have successfully registered for the Capco Global Challenge with your Strava account. \n\r" +
                                "If you wish to create or join a team as part of the challenge, please go here: " + callbackUrl + "teams/register \n\r" +
                                "Once the challenge starts you can view your progress here: " + callbackUrl + "\n\r" +
                                "Good Luck \n\r Capco Health & Wellbeing";
                                */

                                let emailText = "Hello " + user.name + ",\n\rYou have successfully registered for the Capco Global Challenge with your Strava account. \n\r" +
                                "Once the challenge starts you can view your progress here: " + callbackUrl + "\n\r" +
                                "Good Luck \n\rCapco Health & Wellbeing";

                                mailer.sendMail(user.email, "Capco Challenge Registration Successfull", emailText, function() {
                                    console.log("email sent to " + user.email);
                                });

                                res.redirect(callbackUrl + 'register?success=stravaSuccess');
                            }
                        });
                    }
                });
            }
        });

        newReq.end();
    }
};

function updateAccessTokens(user) {
    User.findOne({
        email: user.email.toLowerCase()
    }).exec(function(err, existingUser) {
        if (err || !existingUser) {
            console.log("Error updating existing useer access tokens during re-registration");
        } else {
            existingUser.access_token = user.access_token;
            existingUser.refresh_token = user.refresh_token;
            existingUser.expires_in = user.expires_in;
            user.expires_at = user.expires_at;

            existingUser.markModified('access_token');
            existingUser.markModified('refresh_token');
            existingUser.markModified('expires_in');
            existingUser.markModified('expires_at');

            existingUser.save(function(err, updatedUser) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

/**
 * Loop through all users and update their stats from Strava
 */
exports.update = function(req, res) {
    User.find({app: 'Strava'}).exec(function(err, users) {
        if (err) {
            res.render('error', { errormsg: "Server error please try again later" });
        } else {
            var userCount = users.length;
            for (var i = 0; i < userCount; i++) {
                if (users[i].access_token) {
                    updateUser(users[i]);
                }
            }
            res.end();
        }
    });
};

function buildRequest(options, callback) {
    console.log(options);
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.body = '';

        res.on('data', function(chunk) {
            res.body += chunk;
        });

        res.on('end', function() {
            var result = JSON.parse(res.body);
            if (result.code) {
                console.log(res.statusCode);
                console.log("result.code: " + result.code);
                callback(result, null);
            } else {
                callback(null, result);
            }
        });

        res.on('error', function(err) {
            console.log('Error sending request: ' + err.message);
        });
    });
    return req;
};

function getStats(user) {
    // Month is an index
    var integerTime = ((new Date(challengeDates[0])).getTime())/1000;
    strava.athlete.listActivities({ 'access_token':user.access_token, after: integerTime }, function(err, result) {
        if (err) {
            console.log("Error Accessing Strava activities for " + user.name);
            if (err.toString().includes("Authorization Error")){
                console.log(user.name + " - User authentication error with Strava");
            } 
            console.log(err);
        } else {
            console.log("Updating Strava Stats for: " + user.name);
            user.activities = result;

            // Update Stats Totals
            user.totalSteps = 0;
            user.totalDistance = 0;
            user.totalDistanceConverted = 0;
            user.totalDuration = 0;
            user.totalCalories = 0;
            user.totalWalk = 0;
            user.totalRun = 0;
            // user.totalSwim = 0;
            user.totalCycling = 0;
            user.totalCyclingConverted = 0;
            // user.totalRowing = 0;
            user.totalYoga = 0;

            var activityCount = user.activities.length;
            if (activityCount === 0) {
                console.log("No activity data returned for: " + user.name);
            }

            for (var i = 0; i < activityCount; i++) {
                if (challengeDates.includes(user.activities[i].start_date.substring(0,10))) {

                    try {
                        switch (user.activities[i].type) {
                            case 'Run':
                            case 'VirtualRun':
                            case 'Elliptical':
                                user.totalRun = user.totalRun + (user.activities[i].distance/1000);
                                break;
                            // case 'Swim':
                            //     user.totalSwim = user.totalSwim + (user.activities[i].distance/1000);
                            //     break;
                            case 'Ride':
                            case 'VirtualRide':
                            case 'EBikeRide':
                            case 'Handcycle':
                                user.totalCycling = user.totalCycling + (user.activities[i].distance/1000);
                                user.totalCyclingConverted = user.totalCyclingConverted + ((user.activities[i].distance/1000)/CYCLING_CONVERSION);
                                break;
                            // case 'Rowing':
                            // case 'Canoe':
                            // case 'Kayak':
                            // case 'Stand Up Paddle':
                            //     user.totalRowing = user.totalRowing + (user.activities[i].distance/1000);
                            //     break;
                            case 'Walk':
                            case 'Hike':
                            case 'Stair Stepper':
                            case 'Wheelchair':
                                user.totalWalk = user.totalWalk + (user.activities[i].distance/1000);
                                break;
                            case 'Yoga':
                                user.totalWalk = user.totalWalk + (((user.activities[i].moving_time/60)*20)/1000);
                                break;
                            case 'Workout':
                            case 'WeightTraining':
                            case 'Crossfit':
                                user.totalRun = user.totalRun + (((user.activities[i].moving_time/60)*160)/1000);
                                break;
                            default:
                                console.log("Unexpected activity type: " + user.activities[i].type + " - User: " + user.name);
                                break;
                        }

                        // Only add valid activities to the total
                        user.totalDuration = user.totalDuration + user.activities[i].moving_time/60;

                        if (user.activities[i].type === 'Ride' || user.activities[i].type === 'VirtualRide' || 
                                user.activities[i].type === 'EBikeRide' || user.activities[i].type === 'Handcycle') {
                            user.totalDistanceConverted = user.totalDistanceConverted + ((user.activities[i].distance/1000)/CYCLING_CONVERSION);
                            user.totalDistance = user.totalDistance + (user.activities[i].distance/1000);

                        } else if (user.activities[i].type === 'Yoga') {
                            user.totalDistanceConverted = user.totalDistanceConverted + (((user.activities[i].moving_time/60)*20)/1000);
                            user.totalDistance = user.totalDistance + (((user.activities[i].moving_time/60)*20)/1000);

                        } else if (user.activities[i].type === 'Workout' || user.activities[i].type === 'WeightTraining' || user.activities[i].type === 'Crossfit') {
                            user.totalDistanceConverted = user.totalDistanceConverted + (((user.activities[i].moving_time/60)*160)/1000);
                            user.totalDistance = user.totalDistance + (((user.activities[i].moving_time/60)*160)/1000);

                        } else if (['Run','VirtualRun','Elliptical','Walk','Hike','Stair Stepper','Wheelchair'/*,'Swim','Rowing','Canoe','Kayak','Stand Up Paddle'*/].includes(user.activities[i].type)) {
                            user.totalDistanceConverted = user.totalDistanceConverted + (user.activities[i].distance/1000);
                            user.totalDistance = user.totalDistance + (user.activities[i].distance/1000);
                        }
                    } catch (err) {
                        console.log("Unable to process activity: " + user.activities[i] + " - for User: " + user.name);
                    }
                }
            }

            user.totalRun = Math.floor(user.totalRun*100)/100;
            // user.totalSwim = Math.floor(user.totalSwim*100)/100;
            // user.totalRowing = Math.floor(user.totalRowing*100)/100;
            user.totalCycling = Math.floor(user.totalCycling*100)/100;
            user.totalCyclingConverted = Math.floor(user.totalCyclingConverted*100)/100;
            user.totalWalk = Math.floor(user.totalWalk*100)/100;
            user.totalYoga = Math.floor(user.totalYoga*100)/100;
            
            user.totalDistanceConverted = Math.floor(user.totalDistanceConverted*100)/100;
            user.totalDistance = Math.floor(user.totalDistance*100)/100;

            user.markModified('activities');
            user.save(function(err, newUser) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};

function updateUser(user) {

    var today = new Date();
    // Temporary fix for strange date issue
    if (user.expires_in && (user.expires_in.getTime() < today.getTime() || user.expires_in.getFullYear() > today.getFullYear())) {
        console.log("Strava Token Expired:" + user.name);
        var userOptions = authOptions;
        userOptions.path = "/oauth/token?client_id=" + client_id + "&client_secret=" + secret + "&grant_type=refresh_token&refresh_token=" + user.refresh_token;

         // If token is expired refresh access token and get a new refresh token
        var newReq2 = buildRequest(userOptions, function(err, result) {
            if (err) {
                console.log(user.name + " : " + err.message);
            } else if (result.errors && result.errors.length > 0) {
                console.log(user.name + " : " + JSON.stringify(result.errors[0]));
            } else {

                user.access_token = result.access_token;
                user.refresh_token = result.refresh_token;

                var date = new Date();
                var datemillis = date.getTime();

                var expiresTime = new Date(result.expires_in*1000);
                var expiresTimeMillis = expiresTime.getTime();

                var expiration = new Date();
                expiration.setTime(datemillis + expiresTimeMillis);

                user.expires_in = expiration;
                user.expires_at = result.expires_at;

                user.markModified('access_token');
                user.markModified('refresh_token');
                user.markModified('expires_in');
                user.markModified('expires_at');

                console.log("Successfully obtained new Strava Token for:" + user.name);

                getStats(user);
            }
        });

        newReq2.end();

    } else {
        getStats(user);
    }
};

/**
 * Refresh user strava data every minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){
        console.log("Updating Strava user stats");
        User.find({app: 'Strava'}).exec(function(err, users) {
            if (err) {
                console.log("Data update error please try again later");
            } else {
                var userCount = users.length;
                console.log("Found " + userCount + " Strava users");
                for (var i = 0; i < userCount; i++) {
                    if (users[i].access_token) {
                        updateUser(users[i]);
                    }
                }
                console.log("All User updates complete");
          }
      });
    }, millis);
}
