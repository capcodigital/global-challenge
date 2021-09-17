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

var apiKey = process.env.STRAVA_API_KEY;
var secret = process.env.STRAVA_SECRET;
var client_id = process.env.STRAVA_CLIENT_ID;

if (!apiKey || !secret || !client_id) {
    apiKey = fs.readFileSync('./config/keys/strava_key.txt', 'utf8');
    secret = fs.readFileSync('./config/keys/strava_secret.txt', 'utf8');
    client_id = fs.readFileSync('./config/keys/strava_client.txt', 'utf8');
}

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
const challengeName = process.env.CHALLENGE_NAME ? `${process.env.CHALLENGE_NAME}` : 'dev';

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    if (process.env.SERVER_URL) {
        updateEveryInterval(60);
    }
    else {
        updateEveryInterval(5);
    }
}

exports.authorize = function(req, res) {

    if (!req.query.code || req.query.error) {
        res.render('error', { user: "Could not authenticate with your Strava account" });
    } else {
        var username = req.query.state;
        var userOptions = authOptions;
        userOptions.path = "/oauth/token?client_id=" + client_id + "&client_secret=" + secret + "&code=" + req.query.code;

        var newReq = buildRequest(userOptions, function(err, result){
            if (err) {
                console.log("Request Error: " + err);
                res.redirect(callbackUrl + 'register?success=stravaError');
            } else {
            
                Capco.find({username: username.toLowerCase()}).exec(function(err, profile) {
                    if (err) {
                        res.render('error', { errormsg: "Could not find your Capco ID" });
                    } else {
                        var user = new User();

                        user.username = username.toLowerCase();
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
                        user.email = profile.email;
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
                        user.totalSwim = 0;
                        user.totalCycling = 0;
                        user.totalCyclingConverted = 0;
                        user.totalRowing = 0;

                        locations.AddOrUpdate(user.location, username.toLowerCase());
                        levels.AddOrUpdate(user.level, username.toLowerCase());

                        user.save(function(err, newUser) {
                            if (err) {
                                if (err.code == 11000) {
                                    if (user.app == "FitBit") {
                                        res.redirect(callbackUrl + 'register?success=fitBitRegistered');
                                    } else {
                                        res.redirect(callbackUrl + 'register?success=stravaRegistered');
                                    }
                                } else {
                                    console.log(err);
                                    res.redirect(callbackUrl + 'register?success=serverError');
                                }
                            } else {
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
    var integerTime = Number(challengeDates[0]) / 1000;
    strava.athlete.listActivities({ 'access_token':user.access_token, after: integerTime }, function(err, result) {
        if (err) {
            console.log("Error Accessing Strava activities for " + user.name);
            if (err.toString().includes("Authorization Error")){
                console.log(user.name + " - User authentication error with Strava");
            } else {
                console.log(err);
            }
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
            user.totalSwim = 0;
            user.totalCycling = 0;
            user.totalCyclingConverted = 0;
            user.totalRowing = 0;

            var activityCount = user.activities.length;
            for (var i = 0; i < activityCount; i++) {
                if (challengeDates.includes(user.activities[i].start_date.substring(0,10))) {

                    switch (user.activities[i].type) {
                        case 'Run':
                            user.totalRun = Math.round(user.totalRun + (user.activities[i].distance/1000));
                            break;
                        case 'Swim':
                            user.totalSwim = Math.round(user.totalSwim + (user.activities[i].distance/1000));
                            break;
                        case 'Ride':
                            user.totalCycling = Math.round(user.totalCycling + (user.activities[i].distance/1000));
                            user.totalCyclingConverted = Math.round(user.totalCyclingConverted + ((user.activities[i].distance/1000)/config.cyclingConversion));
                            break;
                        case 'Rowing':
                            user.totalRowing = Math.round(user.totalRowing + (user.activities[i].distance/1000));
                            break;
                        case 'Walk':
                            user.totalWalk = Math.round(user.totalWalk + (user.activities[i].distance/1000));
                            break;
                         default:
                            console.log("Unexpected activity type: " + user.activities[i].type + " - User: " + user.name);
                            break;
                    }

                    // Only add valid activities to the total
                    if (['Run','Swim','Ride','Walk','Rowing'].includes(user.activities[i].type)) {
                        // Strava stores distance in metres
                        user.totalDistance = user.totalDistance + (user.activities[i].distance/1000);
                        // Only moving time vs FitBit's Active, Very Active etc
                        user.totalDuration = user.totalDuration + user.activities[i].moving_time;

                        if (user.activities[i].type === 'Ride') {
                            user.totalDistanceConverted = Math.round(user.totalDistanceConverted + ((user.activities[i].distance/1000)/config.cyclingConversion));
                        } else {
                            user.totalDistanceConverted = Math.round(user.totalDistanceConverted + (user.activities[i].distance/1000));
                        }
                    }
                }
            }

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
    if (user.expires_in && user.expires_in.getTime() < today.getTime()) {
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
