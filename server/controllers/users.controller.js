/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Capco = mongoose.model('Capco');
var challenges = require('./challenges.controller');

var challengeDates = [];
challenges.getCurrentChallengeDates(function(dates) {
    challengeDates = dates;
});

/**
 * List of Users Stats
 */
exports.stats = function(req, res, next) {
    User.find({}).sort('name')
        .then((users) => {
            var capco = 0;
            var others = 0;
            var count = users.length;
            var locationList = [];
            var locationCount = {};

            for (var i = 0; i < count; i++) {

                if (!users[i].location) {
                    users[i].location = "Other";
                }

                if (!locationCount[users[i].location]) {
                    locationList.push();
                    locationCount[users[i].location] = 1;
                } else {
                    locationCount[users[i].location]++;
                }
            }

            res.json({ total: count, locationCounts: locationCount });

        }).catch((err) => {
            console.log(err);
            res.json({error: "Server error please try again later" });
        });
};

/**
* All Users data
*/
exports.all = function(req, res, next) {

   // Get all the users first so we can include their real names etc.
   User.find({}).select('name _id location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalYoga totalCycling totalCyclingConverted totalRowing').sort({totalDistanceConverted: -1})
    .then((users) => {
        res.jsonp(users);
    }).catch((err) => {
        console.log("Data error please try again later");
    });
};

/**
 * Add Manual Steps for a one off event
 */
exports.addManual = function(req, res) {

    if (!req.query.authcode || req.query.authcode !== "Wellbeing1") {
        res.json({error: "Manual event not added - Invalid Authorization Code" });
    } else {
        var user = new User();

        user.username = req.query.eventname;
        user.user_id = req.query.eventname;
        user.name = req.query.eventname;

        user.location = req.query.location;
        user.level = "Other";

        user.activities = {};
        user.totalSteps = req.query.steps;
        user.totalDistance = req.query.steps;
        user.totalDuration = req.query.steps;
        user.totalCalories = req.query.steps;

        user.save(function(err, newUser) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    res.json({error: "Manual event not added - Event Name has already been registered" });
                } else {
                    res.json({error: "Manual event not added - Server error please try again later" });
                }
            } else {
                console.log("Added " + newUser.totalSteps + " for " + newUser.username);
                res.json({success: {}});
            }
        })
    }
};

/**
 * List of Users
 */
exports.list = function(req, res, next) {
    User.find({}).select('name _id').sort('name')
        .then((users) => {
            res.jsonp(users);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * Inactive Users
 */
exports.inactiveUsers = function(req, res, next) {
    User.find({totalDistance: 0}).select('name email app location level expires_in activities')
        .then((users) => {
            let resultList = [];
            let inactiveCount = users.length;
            for (let i = 0; i < inactiveCount; i++) {

                let inactiveUser = {
                    name: users[i].name,
                    email: users[i].email,
                    app: users[i].app,
                    location: users[i].location,
                    level: users[i].level,
                    tokenExpiry: users[i].expires_in
                };

                if (!users[i].activities || users[i].activities == null) {
                    inactiveUser.issue = "Activity API returning an error";
                } else if (users[i].activities.length == 0) {
                    inactiveUser.issue = "No activity data returned from Tracking API";
                } else {
                    let validActivityDays = 0;

                    if (users[i].app === "FitBit") {

                        var activityCount = challengeDates.length;
                        for (var j = 0; j < activityCount; j++) {
                            if (users[i].activities[challengeDates[j]]) {
                                validActivityDays++;
                            }
                        }

                    } else if (users[i].app === "Strava") {
                        let activityCount = users[i].activities.length;

                        for (var j = 0; j < activityCount; j++) {
                            if (challengeDates.includes(users[i].activities[j].start_date.substring(0,10))) {
                                validActivityDays++;
                            }
                        }
                    }

                    if (validActivityDays == 0) {
                        inactiveUser.issue = "No data retruned for challenge dates but API is returning other data";

                    } else {
                        inactiveUser.issue = "Data returned for challenge dates is all zero";
                    }
                }

                resultList.push(inactiveUser);
            }
            res.jsonp(resultList);
        }).catch((err) => {
            console.log(err);
            res.json({error: "Server error please try again later" });
        });
};

/**
 * User App Totals
 */
exports.userAppTotals = function(req, res, next) {
    User.find({}).select('name email app location level totalDistance')
        .then((users) => {
            res.jsonp(users);
        }).catch((err) => {
            console.log(err);
            res.json({error: "Server error please try again later" });
        });
};

/**
 * Remove member from a team
 */
exports.removeById = function(req, res) {

    let errorMessage = "Unable to remove user " + user.name;

    User.findOne({_id: mongoose.Types.ObjectId(req.query.user)})
        .then((user) => {
            if (!user) {
                res.send(400, { message: errorMessage});
                return;
            }
            if (user == null) {
                res.send(400, { message: errorMessage});
                return;
            }
    
            user.delete(function(err) {
                if (err) {
                    console.log(errorMessage);
                    res.send(400, { message: errorMessage});
                } else {
                    res.send(200, {message: 'Successfully removed user: ' + user.name});
                }
            });
        }).catch((err) => {
            res.send(400, { message: errorMessage});
            return;
        });        
};
