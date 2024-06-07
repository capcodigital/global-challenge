/**
 * Module dependencies.
 */
var mongoose = require("mongoose");
var https = require("https");
var challenges = require('./challenges.controller');
var levels = require('./levels.controller');
var locations = require('./locations.controller');
var countries = require('./countries.controller');
var User = mongoose.model('User');
var Capco = mongoose.model('Capco');
var config = require("../config/config");
var mailer = require('../services/mail.service');
var constants = require('../util/constants');

var _ = require('lodash');
var cluster = require('cluster');
var fs = require('fs');

var secret = process.env.FITBIT_SECRET;
var client_id = process.env.FITBIT_CLIENT_ID;

if (!secret) secret = fs.readFileSync('./config/keys/fitbit_secret.txt', 'utf8');
if (!client_id) client_id = fs.readFileSync('./config/keys/fitbit_client.txt', 'utf8');

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';
const challengeName = process.env.CHALLENGE_NAME;
const CYCLING_CONVERSION = config.cyclingConversion || 3;

var challengeDates = [];
challenges.getCurrentChallengeDates(function(dates) {
    challengeDates = dates;
});
var code = client_id + ':' + secret;
var authorizationCode = "Basic " + new Buffer(code).toString('base64');

var headers = {
    'Authorization' : authorizationCode,
    'Content-Type': 'application/x-www-form-urlencoded'
};

var postOptions = {
  hostname: 'api.fitbit.com',
  method: 'POST',
  port: 443,
  headers: headers,
  agent: false
};

var getOptions = {
  hostname: 'api.fitbit.com',
  method: 'GET',
  headers: {
    Authorization: "Bearer ",
  },
  port : 443,
  agent: false,
};

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

    if (req.query.success) {
        res.end();
    } else if (!req.query.code || req.query.error) {
        console.log("Could not authenticate with your Fitbit account");
        res.redirect(callbackUrl + 'register?success=fitBitError');
    } else {
        var email = req.query.state.toLowerCase();
        postOptions.path = "/oauth2/token?" + "code=" + req.query.code + "&grant_type=authorization_code" + "&client_id=" + client_id + "&client_secret=" + secret + "&redirect_uri=" + callbackUrl + "fitbit/auth";

        buildRequest("Register " + email, postOptions)
            .then((result) => {
                Capco.findOne({email: email.toLowerCase()})
                    .then((profile) => {
                        if (!profile) {
                            res.json({error: "Could not find your Capco email [" + email + "]"});
                        } else {
                            var user = new User();
    
                            var date = new Date();
                            var datemillis = date.getTime();
    
                            var expiresTime = new Date(result.expires_in*1000);
                            var expiresTimeMillis = expiresTime.getTime();
    
                            var expiration = new Date();
                            expiration.setTime(datemillis + expiresTimeMillis);
    
                            user.email = email.toLowerCase();
                            user.app = "FitBit";
                            user.user_id = result.user_id;
                            user.token_type = result.token_type;
                            user.expires_in = expiration;
                            user.access_token = result.access_token;
                            user.refresh_token = result.refresh_token;
    
                            user.level = profile.level;
                            user.name = profile.name;
                            user.location = profile.location;
                            user.country = profile.country;
    
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
                            user.totalRowing = 0;
                            user.totalYoga = 0;

                            console.log("Saving new user: " + user.name);
                            user.save()
                                .then((newUser) => {
                                    locations.AddOrUpdate(newUser.location, newUser._id);
                                    levels.AddOrUpdate(newUser.level, newUser._id);
                                    countries.AddOrUpdate(newUser.country, newUser._id);

                                    // If User has joined part way through the competition. Retrieve previous days stats in the background
                                    console.log("Updtaing stats in case user joined part way through:" + user.name);

                                    let statUpdateList = [];

                                    challengeDates.forEach((date) => {
                                        let statUpdate = getStats(newUser, date);
                                        statUpdateList.push(statUpdate);
                                    });

                                    Promise.allSettled(statUpdateList).then((results) => {

                                        results.forEach((result) => {
                                            if (result.status === 'rejected') {
                                                console.log("Error occured getting stats for: " + user.name);
                                            }
                                        });
                                    
                                        console.log("Saving after updating stats:" + user.name);
                                        newUser.save()
                                            .then((updatedUser) => {
                                            }).catch((err) => {
                                                console.log(err);
                                            });

                                        /*
                                        let emailText = "Hello " + user.name + ",\n\rYou have successfully registered for the Capco Global Challenge with your FitBit account. \n\r" +
                                                        "If you wish to create or join a team as part of the challenge, please go here: " + callbackUrl + "teams/register \n\r" +
                                                        "Once the challenge starts you can view your progress here: " + callbackUrl + "\n\r" +
                                                        "Thank you for your support - and good luck \n\rCapco Health & Wellbeing";
                                        */

                                        let emailText = "Hello " + user.name + ",\n\rYou have successfully registered for the Capco Global Challenge with your FitBit account. \n\r" +
                                                        "Once the challenge starts on June 5th, you can view your progress here: " + callbackUrl + "\n\r" +
                                                        "If you did not register or wish to be removed from the challenge and your account deleted please email the support team" +
                                                        " challenge@capco.com\n\r" +
                                                        "Thank you for your support - and good luck \n\rCapco Health & Wellbeing";

                                        mailer.sendMail(user.email, "Capco Challenge Registration Successfull", emailText, function() {
                                            console.log("email sent to " + user.email);
                                        });

                                        res.redirect(callbackUrl + 'register?success=fitBitSuccess');
                                    });

                                    console.log("After promise all settled:" + user.name);

                                }).catch((err) => {
                                    console.log(err.message);
                                    if (err.code == 11000) {
                                        if (user.app === "Strava") {
                                            res.redirect(callbackUrl + 'register?success=stravaRegistered');
                                        } else {
                                            // Already registered but update the users access tokens anyway so we have the latest expiry
                                            updateAccessTokens(user);
                                            res.redirect(callbackUrl + 'register?success=fitbitRegistered');
                                        }
                                    } else {
                                        res.redirect(callbackUrl + 'register?success=serverError');
                                    }
                                });
                        }
                    }).catch((err) => {
                        res.json({error: "Could not find your Capco email [" + email + "]"});
                    });
            }).catch((err) => {
                console.log("Request Error: " + err);
                res.redirect(callbackUrl + 'register?success=fitBitError');
            });
    }
};

/**
* Loop through all users and update their stats from fitbit
*/
exports.update = function(req, res) {
    User.find({app: 'FitBit'})
        .then((users) => {
            var userCount = users.length;
            for (var i = 0; i < userCount; i++) {
                if (users[i].access_token) {
                    updateUser(users[i]);
                }
            }
            res.end();
        }).catch((err) => {
            res.json({error: "Server error please try again later"});
        });
};

/**
* Update specified user's stats from fitbit
*/
exports.updateIndividualUser = function(req, res) {
    User.find({email: req.params.user})
        .then((users) => {
            if (!users || users.length == 0) {
                res.json({error: "User not found"});
            } else {
                console.log("Updating User: " + users[0].name);
                challengeDates.forEach(function(date) {
                    getStats(users[0], date);
                });

                users[0].save()
                    .then((updatedUser) => {
                    }).catch((err) => {
                        console.log(err);
                    });

                res.json({
                    name: users[0].name,
                    email: users[0].email,
                    location: users[0].location,
                    level: users[0].level,
                    totalDistance: users[0].totalDistance
                });
            }
        }).catch((err) => {
            res.json({error: "Server error please try again later"});
        });
};

function buildRequest(requestDetail, requestOptions) {
    return new Promise((resolve, reject) => {
        var req = https.request(requestOptions, (res) => {
            res.setEncoding('utf8');
            res.body = '';

            res.on('data', function(chunk) {
                res.body += chunk;
            });

            res.on('end', () => {
                var result = JSON.parse(res.body);
                if (result.code) {
                    console.log(res.statusCode);
                    console.log("Error code for -  " + requestDetail + " - " + result.code);
                    if (result.errors && result.errors.length > 0) {
                        console.log(result.errors[0].message);
                        console.log(JSON.stringify(result.errors[0]));
                    }
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        });

        req.on('error', function(err) {
            console.log("Error sending request to -  " + requestDetail + " - " + err.message);
            reject(err);
        });

        req.on('timeout', function(err) {
            console.log("Request timed out to -  " + requestDetail + " - " + err.message);
            reject(err);
        });

        req.end();
    });
};

function updateUser(user) {
    var today = new Date();
    // Temporary fix for strange date issue
    if (user.expires_in && (user.expires_in.getTime() < today.getTime() || user.expires_in.getFullYear() > today.getFullYear())) {
        console.log("FitBit Token Expired:" + user.name);
        postOptions.path = "/oauth2/token?" + "grant_type=refresh_token&refresh_token=" + user.refresh_token;

         // If token is expired, refresh access token and get a new refresh token
        buildRequest("Update token for " + user.name, postOptions)
            .then((result) => {

                if (result.errors && result.errors[0]) {
                    console.log("Token Refresh Error: " + result.errors[0].message);
                }

                var date = new Date();
                var datemillis = date.getTime();

                var expiresTime = new Date(result.expires_in*1000);
                var expiresTimeMillis = expiresTime.getTime();

                var expiration = new Date();
                expiration.setTime(datemillis + expiresTimeMillis);

                user.access_token = result.access_token;
                user.refresh_token = result.refresh_token;
                user.expires_in = expiration;

                user.markModified('access_token');
                user.markModified('refresh_token');
                user.markModified('expires_in');

                console.log("Successfully obtained new FitBit Token for:" + user.name);

                getStats(user).then((results) => {
                    user.save()
                        .then((updatedUser) => {
                        }).catch((err) => {
                            console.log(err);
                        });
                    });
                
            }).catch((err) => {
                console.log(user.name + " : " + err);
            });
    } else {
        getStats(user).then((results) => {
            user.save()
                .then((updatedUser) => {
                }).catch((err) => {
                    console.log(err);
                });
        });
    }
}

function getStats(user, date) {
    if (!date) {
        var today = new Date();
        date = today.toISOString().split('T')[0];
    }
    getOptions.path = "/1/user/" + user.user_id + "/activities/date/" + date + ".json";
    getOptions.headers.Authorization = "Bearer " + user.access_token;

    return buildRequest("Update stats for " + user.name, getOptions)
        .then((result) => {
            result.date = date;
            if (!user.activities) {
                user.activities = {};
            }

            if (result.summary) {
                user.activities[date] = result;
            } else {
                console.log("No FitBit result summary for: " + user.name);
            }

            console.log("Updating FitBit Stats for: " + user.name);

            // Update Stats Totals - FitBit stores distance in KM
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
            user.totalRowing = 0;
            user.totalYoga = 0;

            var activityCount = challengeDates.length;
            for (var i = 0; i < activityCount; i++) {

                try {
                    if (user.activities[challengeDates[i]] && user.activities[challengeDates[i]].activities) {

                        user.activities[challengeDates[i]].activities.forEach (function(activityEntry) {
                            switch (activityEntry.name) {
                                case 'Run':
                                // case 'Swim':
                                case 'Bike':
                                case 'Outdoor Bike':
                                case 'Walk':
                                    // Ignore as handled later
                                    break;
                                case 'Treadmill':
                                case 'Elliptical':
                                    user.totalRun = user.totalRun + activityEntry.distance;
                                    user.totalDistanceConverted = user.totalDistanceConverted + activityEntry.distance;
                                    user.totalDistance = user.totalDistance + activityEntry.distance;
                                    user.totalDuration = user.totalDuration + activityEntry.duration;
                                    break;
                                case 'Yoga':
                                    user.totalWalk = user.totalWalk + (((activityEntry.duration/60000)*20)/1000);
                                    user.totalDistanceConverted = user.totalDistanceConverted + (((activityEntry.duration/60000)*20)/1000);
                                    user.totalDistance = user.totalDistance + (((activityEntry.duration/60000)*20)/1000);
                                    user.totalDuration = user.totalDuration + ((activityEntry.duration)/60000);
                                    break;
                                case 'Circuit Training':
                                case 'Aerobic Workout':
                                case 'Sport':
                                case 'Workout':
                                    user.totalRun = user.totalRun + (((activityEntry.duration/60000)*160)/1000);
                                    user.totalDistanceConverted = user.totalDistanceConverted + (((activityEntry.duration/60000)*160)/1000);
                                    user.totalDistance = user.totalDistance + (((activityEntry.duration/60000)*160)/1000);
                                    user.totalDuration = user.totalDuration + ((activityEntry.duration)/60000);
                                    break;
                                default:
                                    console.log("Unexpected activity type: " + JSON.stringify(activityEntry) + " - User: " + user.name);
                                    break;
                            }
                        });
                    }

                    if (user.activities[challengeDates[i]] && user.activities[challengeDates[i]].summary && user.activities[challengeDates[i]].summary.distances) {

                        user.activities[challengeDates[i]].summary.distances.forEach (function(activityEntry) {
                            switch (activityEntry.activity) {
                                case 'Run':
                                    user.totalRun = user.totalRun + activityEntry.distance;
                                    break;
                                // case 'Swim':
                                //     user.totalSwim = user.totalSwim + activityEntry.distance;
                                //     break;
                                case 'Bike':
                                case 'Outdoor Bike':
                                    user.totalCycling = user.totalCycling + activityEntry.distance;
                                    user.totalCyclingConverted = user.totalCyclingConverted + (activityEntry.distance/CYCLING_CONVERSION);
                                    break;
                                case 'Walk':
                                case 'tracker':
                                    user.totalWalk = user.totalWalk + activityEntry.distance;
                                    break;
                                default:
                                    break;
                            }

                            // Only add valid activities to the total
                            if (['Run',/*'Swim',*/'Bike','Walk','tracker'].includes(activityEntry.activity)) {
                                // user.totalDuration = user.totalDuration + ((activityEntry.duration)/60000);

                                if (activityEntry.name === 'Bike' && activityEntry.distance > 0) {
                                    user.totalDistanceConverted = user.totalDistanceConverted + (activityEntry.distance/CYCLING_CONVERSION);
                                    user.totalDistance = user.totalDistance + activityEntry.distance;
                                } else {
                                    user.totalDistanceConverted = user.totalDistanceConverted + activityEntry.distance;
                                    user.totalDistance = user.totalDistance + activityEntry.distance;
                                }
                            }
                        });
                    }

                } catch (err) {
                    console.log("Unable to process activity: " + user.activities[challengeDates[i]] + " - for User: " + user.name);
                }
            }

            user.totalRun = Math.floor(user.totalRun*100)/100;
            // user.totalSwim = Math.floor(user.totalSwim*100)/100;
            user.totalCycling = Math.floor(user.totalCycling*100)/100;
            user.totalCyclingConverted = Math.floor(user.totalCyclingConverted*100)/100;
            user.totalWalk = Math.floor(user.totalWalk*100)/100;
            user.totalYoga = Math.floor(user.totalYoga*100)/100;
            user.totalDistanceConverted = Math.floor(user.totalDistanceConverted*100)/100;
            user.totalDistance = Math.floor(user.totalDistance*100)/100;

            console.log("User stats modified:" + date);
            user.markModified('activities');
        
        }).catch((err) => {
            console.log(user.name + " : " + err);
        });
}

function updateAccessTokens(user) {
    User.findOne({email: user.email.toLowerCase()})
        .then((existingUser) => {
            if (!existingUser) {
                console.log("Error updating existing useer access tokens during re-registration");
            } else {
                existingUser.access_token = user.access_token;
                existingUser.refresh_token = user.refresh_token;
                existingUser.expires_in = user.expires_in;
    
                existingUser.markModified('access_token');
                existingUser.markModified('refresh_token');
                existingUser.markModified('expires_in');
    
                console.log("Saving new access token for:" + existingUser.name);
                existingUser.save()
                    .then((updatedUser) => {

                        let statUpdateList = [];
                        challengeDates.forEach((date) => {
                            let statUpdate = getStats(updatedUser, date);
                            statUpdateList.push(statUpdate);
                        });

                        Promise.allSettled(statUpdateList).then((results) => {

                            results.forEach((result) => {
                                if (result.status === 'rejected') {
                                    console.log("Error occured getting stats for: " + user.name);
                                }
                            });
                        
                            console.log("Saving after updating stats:" + user.name);
                            updatedUser.save()
                                .then((fullyUpdatedUser) => {
                                }).catch((err) => {
                                    console.log(err);
                                });
                            });

                    }).catch((err) => {
                        console.log(err);
                    });
            }
        }).catch((err) => {
            console.log("Error updating existing useer access tokens during re-registration");
        });
}

/**
 * Refresh user fitbit data every minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){
        console.log("Updating FitBit user stats");
        User.find({app: 'FitBit'})
            .then((users) => {
                var userCount = users.length;
                console.log("Found " + userCount + " FitBit users");
                for (var i = 0; i < userCount; i++) {
                    if (users[i].access_token) {
                        updateUser(users[i]);
                    }
                }
                console.log("All User updates triggered");
            }).catch((err) => {
                console.log("FitBit Data update error please try again later:" + err);
            });

    }, millis);
}
