/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var https = require("https");
var citService = require('../services/cit.service');
var User = mongoose.model('User');
var _ = require('lodash');
var cluster = require('cluster');

var secret = "1b057c2e46b0dd19ec40cba83f9d8da3";
var client_id = "228MZ3";

var startDate = new Date(2018,9,17);
var integerTime = Number(startDate) / 1000;

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
updateEveryInterval(1);

/**
* List of Users
*/
exports.authorize = function(req, res) {

    if (!req.query.code || req.query.error) {
        res.render('error', { user: " Could not authenticate with your Fitbit account"});
    } else {
        var username = req.query.state;
        if (process.env.NODE_ENV === "production") {
            options.path = "/oauth2/token?" + "code=" + req.query.code + "&grant_type=authorization_code" + "&client_id=" + client_id + "&client_secret=" + secret + "&redirect_uri=https://capcoglobalchallenge.com/fitbit/auth";
        } else {
            options.path = "/oauth2/token?" + "code=" + req.query.code + "&grant_type=authorization_code" + "&client_id=" + client_id + "&client_secret=" + secret + "&redirect_uri=https://localhost:3000/fitbit/auth";
        }

        console.log("PATH: " + options.path);

        var newReq = buildRequest(options, function(err, result) {
            if (err) {
              console.log(err);
            } else {
                citService.getUser(username.toLowerCase(), function(err, profile) {
                    if (err) {
                        res.render('error',{'errormsg': "Could not find your Capco ID"});
                    } else {
                        var user = new User();

                        var date = new Date();
                        var datemillis = date.getTime();

                        var expiresTime = new Date(result.expires_in*1000);
                        var expiresTimeMillis = expiresTime.getTime();

                        var expiration = new Date();
                        expiration.setTime(datemillis + expiresTimeMillis);

                        user.username = username;
                        user.user_id = result.user_id;
                        user.token_type = result.token_type;
                        user.expires_in = expiration;
                        user.access_token = result.access_token;
                        user.refresh_token = result.refresh_token;

                        user.level = profile.title;
                        user.name = profile.displayName;
                        user.location = profile.locationName;
                        user.picName = profile.profilePictureName;

                        user.totalSteps = 0;
                        user.totalCalories = 0;
                        user.totalDistance = 0;
                        user.totalDuration = 0;

                        save(user, res);
                    }
                })
            }
        });

        newReq.end();
    }
};

/**
* Loop through all users and update their stats from fitbit
*/
exports.update = function(req, res) {
    User.find().exec(function(err, users) {
        if (err) {
            res.render('error', { errormsg: "Server error please try again later"});
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
    if (user.expires_in < today) {
        console.log("Token Expired:" + user.expires_in);
        // If token is expired refresh access token and get a new refresh token
        options.path = "/oauth2/token?" + "grant_type=refresh_token&refresh_token=" + user.refresh_token;
        console.log("PATH: " + options.path);

        var newReq2 = buildRequest(options, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("New Token details: " + JSON.stringify(result));
                var date = new Date();
                var datemillis = date.getTime();

                var expiresTime = new Date(result.expires_in*1000);
                var expiresTimeMillis = expiresTime.getTime();

                var expiration = new Date();
                expiration.setTime(datemillis + expiresTimeMillis);

                user.access_token = result.access_token;
                user.refresh_token = result.refresh_token;
                user.expires_in = expiration;
            }

            newReq2.end();
            getStats();
        });
    } else {
        getStats();
    }

    return user;

    function getStats() {
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        getOptions.path = "/1/user/" + user.user_id + "/activities/date/" + date + ".json";
        getOptions.headers.Authorization = "Bearer " + user.access_token;

        var newReq = buildRequest(getOptions, function(err, result) {
            if (err) {
                console.log(err);
            } else {

                result.date = date;
                var dbDate = user.activities.map(a => a.date);
                var lastdate = dbDate[dbDate.length - 1];

                // Check if we are updating the current day or adding a new one
                if (date == lastdate) {
                    user.activities[user.activities.length - 1] = result;
                } else {
                    user.activities.push(result);
                }

                // Update Stats Totals
                user.totalSteps = 0;
                user.totalDistance = 0;
                user.totalDuration = 0;
                user.totalCalories = 0;

                var activityCount = user.activities.length;
                for (var i = 0; i < activityCount; i++) {
                    user.totalSteps = user.totalSteps + user.activities[i].summary.steps;
                    user.totalDistance = user.totalDistance + user.activities[i].summary.distances[0].distance;
                    user.totalDuration = user.totalDuration + user.activities[i].summary.fairlyActiveMinutes + user.activities[i].summary.lightlyActiveMinutes + user.activities[i].summary.veryActiveMinutes;
                    user.totalCalories = user.totalCalories + user.activities[i].summary.activityCalories;
                }

                user.save(function(err, newUser) {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            
        });

        newReq.end();
    }
}

function save(user, res) {
    user.save(function(err, newUser) {
        if (err) {
            console.log(err.message);
            if (err.code == 11000) {
                if (err.message.indexOf("username_1") > 0) {
                    res.render('error', { errormsg: "You are already logged in to Fitbit with a user that has previously registered for the Global Challenge. If you need to register someone else, please log out of Fitbit and try again." });
                } else {
                    res.render('error', { errormsg: "The Capco ID or Email you entered has already been registered" });
                }
            } else {
                res.render('error', { errormsg: "Server error please try again later" });
            }
        } else {
            res.render('success', {});
        }
    })
}

/**
 * Refresh user fitbit data every minutes
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
