/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var https = require("https");
var citService = require('../services/cit.service');
var User = mongoose.model('User');
var strava = require('strava-v3');

var apiKey = "808302c7e373c0fe3ce7cba05f44f291e59c4b7c";
var secret = "4c591acd2508859f95b9a40f4522fe82247bcdb9";
var client_id = 7291;
var startDate = new Date(2020,10,01);
var integerTime = Number(startDate) / 1000;

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

var callbackUrl = "capcoglobalchallenge.com"
if (process.env.NODE_ENV != "production") {
    callbackUrl = "localhost";
}

/**
 * List of Users
 */
exports.authorize = function(req, res) {

    if (!req.query.code || req.query.error) {
        res.render('error', { user: "Could not authenticate with your Strava account" });
    } else {
        var username = req.query.state;
        console.log(username);
        var userOptions = authOptions;
        userOptions.path = "/oauth/token?client_id=" + client_id + "&client_secret=" + secret + "&code=" + req.query.code;

        var newReq = buildRequest(userOptions, function(err, result){
            if (err) {
                console.log(err);
                res.redirect('https://' + callbackUrl + '?success=stravaError');
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
                        user.athlete_id = result.athlete.id;

                        user.name = profile.displayName;
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
                        user.totalDuration = 0;


                        user.save(function(err, newUser) {
                            if (err) {
                                console.log(err);
                                if (err.code == 11000) {
                                    if (user.app == "FitBit") {
                                        res.redirect('https://' + callbackUrl + '?success=fitBitRegistered');
                                    } else {
                                        res.redirect('https://' + callbackUrl + '?success=stravaRegistered');
                                    }
                                } else {
                                    res.redirect('https://' + callbackUrl + '?success=serverError');
                                }
                            } else {
                                res.redirect('https://' + callbackUrl + '?success=stravaSuccess');
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

function getUserStats(user) {
    strava.athletes.stats({ 'id':user.athlete_id, 'access_token':user.access_token },function(err, payload) {
        if(err) {
            console.log(err);
        }
        else {
            console.log(payload);
        }
    });
};

function updateUser(user) {
    strava.athlete.listActivities({ 'access_token':user.access_token, after: integerTime }, function(err, result) {
        if (err) {
            console.log("Error");
            console.log(err);
        } else {

            user.activities = result;

            user.save(function(err, newUser) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};
