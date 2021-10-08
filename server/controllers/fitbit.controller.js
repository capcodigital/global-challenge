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
var config = require("../config/config");

var _ = require('lodash');
var cluster = require('cluster');
var fs = require('fs');

var secret = process.env.FITBIT_SECRET;
var client_id = process.env.FITBIT_CLIENT_ID;

if (!secret || !client_id) {
    secret = fs.readFileSync('./config/keys/fitbit_secret.txt', 'utf8');
    client_id = fs.readFileSync('./config/keys/fitbit_client.txt', 'utf8');
}

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';
const challengeName = process.env.CHALLENGE_NAME;

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

                Capco.findOne({username: username.toUpperCase()}).exec(function(err, profile) {
                    if (err || !profile) {
                        res.json({error: "Could not find your Capco ID"});
                    } else {
                        var user = new User();

                        var date = new Date();
                        var datemillis = date.getTime();

                        var expiresTime = new Date(result.expires_in*1000);
                        var expiresTimeMillis = expiresTime.getTime();

                        var expiration = new Date();
                        expiration.setTime(datemillis + expiresTimeMillis);

                        user.username = username.toLowerCase();
                        user.app = "FitBit";
                        user.user_id = result.user_id;
                        user.token_type = result.token_type;
                        user.expires_in = expiration;
                        user.access_token = result.access_token;
                        user.refresh_token = result.refresh_token;

                        user.level = profile.level;
                        user.name = profile.name;
                        user.email = profile.email;

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

         // If token is expired, refresh access token and get a new refresh token
        var newReq2 = buildRequest(options, function(err, result) {
            if (err) {
                console.log(user.name + " : " + err);
            } else if (result.errors && result.errors.length > 0) {
                console.log(user.name + ": " + result.errors[0].message);
                console.log(JSON.stringify(result.errors[0]));
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
        date = today.toISOString().split('T')[0];
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

                    user.activities[challengeDates[i]].summary.distances.forEach (function(activityEntry) {
                        switch (activityEntry.activity) {
                            case 'Run':
                                user.totalRun = Math.round(user.totalRun + (activityEntry.distance));
                                break;
                            case 'Swim':
                                user.totalSwim = Math.round(user.totalSwim + (activityEntry.distance));
                                break;
                            case 'Bike':
                                user.totalCycling = Math.round(user.totalCycling + (activityEntry.distance));
                                user.totalCyclingConverted = Math.round(user.totalCyclingConverted + ((activityEntry.distance)/config.cyclingConversion));
                                break;
                            case 'Walk':
                                user.totalWalk = Math.round(user.totalWalk + (activityEntry.distance));
                                break;
                            // case 'Yoga':
                            //     user.totalWalk = Math.round(user.totalWalk + (user.activities[i].moving_time*20));
                            //     break;
                            // case 'Circuit Training':
                            //     user.totalRun = Math.round(user.totalRun + (user.activities[i].moving_time*160));
                            //     break;
                            case 'total':
                            case 'loggedActivities':
                            case 'sedentaryActive':
                            case 'lightlyActive':
                            case 'moderatelyActive':
                            case 'veryActive':
                                // Ignore supplied totals as they may contain extra activties
                                break;
                            default:
                                console.log("Unexpected activity type: " + activityEntry.activity + " - User: " + user.name);
                                break;
                        }

                        // Only add valid activities to the total
                        if (['Run','Swim','Bike','Walk','Yoga','Circuit Training'].includes(activityEntry.activity)) {
                            // Only moving time vs FitBit's Active, Very Active etc
                            user.totalDuration = user.totalDuration + user.activities[challengeDates[i]].summary.fairlyActiveMinutes + 
                                                                    user.activities[challengeDates[i]].summary.lightlyActiveMinutes + 
                                                                    user.activities[challengeDates[i]].summary.veryActiveMinutes;

                            user.totalDistance = Math.round(user.totalDistance + (activityEntry.distance));

                            if (activityEntry.activity === 'Bike') {
                                user.totalDistanceConverted = Math.round(user.totalDistanceConverted + ((activityEntry.distance)/config.cyclingConversion));
                            } else {
                                user.totalDistanceConverted = Math.round(user.totalDistanceConverted + (activityEntry.distance));
                            }
                        }

                    });
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
            console.log(err.message);
            if (err.code == 11000) {
                if (user.app == "Strava") {
                    res.redirect(callbackUrl + 'register?success=stravaRegistered');
                } else {
                    res.redirect(callbackUrl + 'register?success=fitbitRegistered');
                }
            } else {
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
