/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var https = require("https");
var citService = require('../services/cit.service');
var challenges = require('./challenges.controller');
var User = mongoose.model('User');
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

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    updateEveryInterval(60);
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
            
                citService.getUser(username.toLowerCase(), function(err, profile) {
                    if (err) {
                        res.render('error', { errormsg: "Could not find your Capco ID" });
                    } else {
                        var user = new User();

                        user.username = username;
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

                        user.name = profile.displayName;
                        user.email = profile.email;
                        user.location = profile.location;
                        user.level = profile.title;
                        user.picName = profile.profilePictureName;

                        if (profile.locationName === "New York RISC") {
                            user.location = "New York";
                        } else if (profile.locationName === "Washington DC Metro") {
                            user.location = "Washington DC";
                        } else if (profile.locationName === "Orlando RISC") {
                            user.location = "Orlando";
                        } else if (profile.locationName === "Antwerp") {
                            user.location = "Brussels";
                        } else if (profile.locationName === "Malaysia") {
                            user.location = "Kuala Lumpur";
                        } else {
                            user.location = profile.locationName;
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
    User.find().exec(function(err, users) {
        if (err) {
            res.render('error', { errormsg: "Server error please try again later" });
        } else {
            var userCount = users.length;
            for (var i = 0; i < userCount; i++) {
                if (users[i].app == "Strava" && users[i].access_token) {
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
            console.log("Error");
            console.log(err);
        } else {

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
                    // user.totalSteps = user.totalSteps + user.activities[challengeDates[i]].summary.steps;
                    // Strava stores distance in metres
                    user.totalDistance = user.totalDistance + (user.activities[i].distance/1000);
                    // Only moving time vs FitBit's Active, Very Active etc
                    user.totalDuration = user.totalDuration + user.activities[i].moving_time;
                    // user.totalCalories = user.totalCalories + user.activities[challengeDates[i]].summary.activityCalories;

                    switch (user.activities[i].type) {
                        case 'Run':
                            user.totalRun = user.totalRun + (user.activities[i].distance/1000);
                        case 'Swim':
                            user.totalSwim = user.totalSwim + (user.activities[i].distance/1000);
                        case 'Ride':
                            user.totalCycling = user.totalCycling + (user.activities[i].distance/1000);
                            user.totalCyclingConverted = user.totalCyclingConverted + ((user.activities[i].distance/1000)/config.cyclingConversion);
                        case 'Rowing':
                            user.totalRowing = user.totalRowing + (user.activities[i].distance/1000);
                        default:
                            user.totalWalk = user.totalWalk + (user.activities[i].distance/1000);
                    }

                    if (user.activities[i].type === 'Ride') {
                        user.totalDistanceConverted = user.totalDistanceConverted + ((user.activities[i].distance/1000)/config.cyclingConversion);
                    } else {
                        user.totalDistanceConverted = user.totalDistanceConverted + (user.activities[i].distance/1000);
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
        console.log("Token Expired:" + user.name);
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
        User.find().exec(function(err, users) {
            if (err) {
                console.log("Data update error please try again later");
            } else {
                var userCount = users.length;
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
