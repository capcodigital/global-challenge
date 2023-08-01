/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Capco = mongoose.model('Capco');

/**
 * List of Users Stats
 */
exports.stats = function(req, res, next) {
    User.find({}).sort('name').exec(function(err, users) {
        if (err) {
          console.log(err);
            res.json({error: "Server error please try again later" });
        } else {

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
        }
    });
};

/**
* All Users data
*/
exports.all = function(req, res, next) {

   // Get all the users first so we can include their real names etc.
   User.find({}).select('name _id location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalYoga totalCycling totalCyclingConverted totalRowing').sort({totalDistanceConverted: -1}).exec(function(err, users) {
       if (err) {
           console.log("Data error please try again later");
       } else {
            res.jsonp(users);
       }
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
    User.find({}).select('name _id').sort('name').exec(function(err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};

/**
 * Inactive Users
 */
exports.inactiveUsers = function(req, res, next) {
    User.find({totalDistance: 0}).select('name email app location level expires_in').exec(function(err, users) {
        if (err) {
          console.log(err);
            res.json({error: "Server error please try again later" });
        } else {
          res.jsonp(users);
        }
    });
};

/**
 * User App Totals
 */
exports.userAppTotals = function(req, res, next) {
    User.find({}).select('name email app location level totalDistance').exec(function(err, users) {
        if (err) {
          console.log(err);
            res.json({error: "Server error please try again later" });
        } else {
          res.jsonp(users);
        }
    });
};

/**
 * Remove member from a team
 */
exports.removeById = function(req, res) {

    User.findOne({
        _id: mongoose.Types.ObjectId(req.query.user)
    }).exec(function(err, user) {
        let errorMessage = "Unable to remove user " + user.name;
        if (err) { 
            res.send(400, { message: errorMessage});
            return;
        }
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
    });        
};
