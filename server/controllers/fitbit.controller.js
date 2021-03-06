/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var https = require("https");
var citService = require('../services/cit.service');
var challenges = require('./challenges.controller');
var User = mongoose.model('User');
var _ = require('lodash');
var cluster = require('cluster');
var fs = require('fs');

var secret = process.env.FITBIT_SECRET;
var client_id = process.env.FITBIT_CLIENT_ID;

if (!secret || !client_id) {
    secret = fs.readFileSync('./config/keys/fitbit_secret.txt', 'utf8');
    client_id = fs.readFileSync('./config/keys/fitbit_client.txt', 'utf8');
}

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

var options = {
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
    if (process.env.SERVER_URL) {
        updateEveryInterval(60);
    }
    else {
        updateEveryInterval(5);
    }
}

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

exports.authorize = function(req, res) {

    if (req.query.success) {
        res.end();
    } else if (!req.query.code || req.query.error) {
        res.json({error: { user: " Could not authenticate with your Fitbit account"}});
    } else {
        var username = req.query.state;
        options.path = "/oauth2/token?" + "code=" + req.query.code + "&grant_type=authorization_code" + "&client_id=" + client_id + "&client_secret=" + secret + "&redirect_uri=" + callbackUrl + "fitbit/auth";

        var newReq = buildRequest(options, function(err, result) {
            if (err) {
              console.log(err);
              res.redirect(callbackUrl + 'register?success=fitBitError');
            } else if (result.errors && result.errors.length > 0) {
                console.log(result.errors[0].message);
            } else {

                citService.getUser(username.toLowerCase(), function(err, profile) {
                    if (err) {
                        res.json({error: "Could not find your Capco ID"});
                    } else {
                        var user = new User();

                        var date = new Date();
                        var datemillis = date.getTime();

                        var expiresTime = new Date(result.expires_in*1000);
                        var expiresTimeMillis = expiresTime.getTime();

                        var expiration = new Date();
                        expiration.setTime(datemillis + expiresTimeMillis);

                        user.username = username;
                        user.app = "FitBit";
                        user.user_id = result.user_id;
                        user.token_type = result.token_type;
                        user.expires_in = expiration;
                        user.access_token = result.access_token;
                        user.refresh_token = result.refresh_token;

                        user.level = profile.title;
                        user.name = profile.displayName;
                        user.email = profile.email;
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

                        save(user, res);
                    }
                });
            }
        });

        newReq.end();
    }
};

/**
* Loop through all users and update their stats from fitbit
*/
exports.update = function(req, res) {
    User.find({app: 'FitBit'}).exec(function(err, users) {
        if (err) {
            res.json({error: "Server error please try again later"});
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

/**
* Update specified user's stats from fitbit
*/
exports.updateIndividualUser = function(req, res) {
    User.find({username: req.params.user}).exec(function(err, users) {
        if (err) {
            res.json({error: "Server error please try again later"});
        } else if (!users || users.length == 0) {
            res.json({error: "User not found"});
        } else {
            console.log("Updating User: " + users[0].name);
            challengeDates.forEach(function(date) {
                getStats(users[0], date);
            });
            res.json({
                name: users[0].name,
                username: users[0].username,
                location: users[0].location,
                level: users[0].level,
                totalDistance: users[0].totalDistance
            });
        }
    });
};

function buildRequest(options, callback) {
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

function updateUser(user) {
    var today = new Date();
    if (user.expires_in && user.expires_in.getTime() < today.getTime()) {
        console.log("FitBit Token Expired:" + user.name);
        options.path = "/oauth2/token?" + "grant_type=refresh_token&refresh_token=" + user.refresh_token;

         // If token is expired refresh access token and get a new refresh token
        var newReq2 = buildRequest(options, function(err, result) {
            if (err) {
                console.log(user.name + " : " + err.message);
            } else if (result.errors && result.errors.length > 0) {
                console.log(user.name + " : " + result.errors[0].message);
            } else {
                var date = new Date();
                var datemillis = date.getTime();

                var expiresTime = new Date(result.expires_in*1000);
                var expiresTimeMillis = expiresTime.getTime();

                var expiration = new Date();
                expiration.setTime(datemillis + expiresTimeMillis);

                user.access_token = result.access_token;
                user.refresh_token = result.refresh_token;
                user.expires_in = expiration;

                getStats(user);
            }
        });

        newReq2.end();

    } else {
        getStats(user);
    }
}

function getStats(user, date) {
    if (!date) {
        var today = new Date();
        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    }
    getOptions.path = "/1/user/" + user.user_id + "/activities/date/" + date + ".json";
    getOptions.headers.Authorization = "Bearer " + user.access_token;

    var statsReq = buildRequest(getOptions, function(err, result) {
        if (err) {
            console.log(err);
        } else if (result.errors && result.errors.length > 0) {
            console.log(user.name + " : " + result.errors[0].message);
        } else {
            result.date = date;
            if (result.summary) {
                if (!user.activities) {
                    user.activities = {};
                }
                user.activities[date] = result;
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
            user.totalSwim = 0;
            user.totalCycling = 0;
            user.totalCyclingConverted = 0;
            user.totalRowing = 0;

            var activityCount = challengeDates.length;
            for (var i = 0; i < activityCount; i++) {
                if (user.activities[challengeDates[i]] && user.activities[challengeDates[i]].summary) {

                    const walkTime = user.activities[challengeDates[i]].summary.fairlyActiveMinutes + user.activities[challengeDates[i]].summary.lightlyActiveMinutes;
                    const runTime = user.activities[challengeDates[i]].summary.veryActiveMinutes;
                    const totalTime = walkTime + runTime;

                    user.totalSteps = user.totalSteps + user.activities[challengeDates[i]].summary.steps;
                    user.totalDistance = Math.round(user.totalDistance + user.activities[challengeDates[i]].summary.distances[0].distance);
                    user.totalDistanceConverted = Math.round(user.totalDistanceConverted + user.activities[challengeDates[i]].summary.distances[0].distance);
                    user.totalDuration = user.totalDuration + totalTime;
                    // user.totalCalories = user.totalCalories + user.activities[challengeDates[i]].summary.activityCalories;

                    if (walkTime > 0) {
                        const walkPercentage = walkTime/totalTime;
                        user.totalWalk = Math.round(user.totalWalk + (user.activities[challengeDates[i]].summary.distances[0].distance * walkPercentage));
                    }

                    if (runTime > 0) {
                        const runPercentage = runTime/totalTime;
                        user.totalRun = Math.round(user.totalRun + (user.activities[challengeDates[i]].summary.distances[0].distance * runPercentage));
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

    statsReq.end();
}

function save(user, res) {
    user.save(function(err, newUser) {
        if (err) {
            if (err.code == 11000) {
                if (user.app == "Strava") {
                    res.redirect(callbackUrl + 'register?success=stravaRegistered');
                } else {
                    res.redirect(callbackUrl + 'register?success=fitbitRegistered');
                }
            } else {
                console.log(err.message);
                res.redirect(callbackUrl + 'register?success=serverError');
            }
        } else {
            // If User has joined part way through the competition. Retrieve previous days stats in the background
            challengeDates.forEach(function(date) {
                getStats(newUser, date);
            });

            res.redirect(callbackUrl + 'register?success=fitBitSuccess');
        }
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
        User.find({app: 'FitBit'}).exec(function(err, users) {
            if (err) {
                console.log("Data update error please try again later");
            } else {
                var userCount = users.length;
                console.log("Found " + userCount + " FitBit users");
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
