/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var User = mongoose.model('User');
var citService = require('../services/cit.service');

/**
 * List of Users
 */
exports.stats = function(req, res, next) {
    User.find({}).sort('name').exec(function(err, users) {
        if (err) {
          console.log(err);
            res.render('error', { errormsg: "Server error please try again later" });
        } else {

          var capco = 0;
          var others = 0;
          var count = users.length;

          for (var i = 0; i < count; i++) {
            if (users[i].username.length == 4) {
              capco++;
            } else {
              others++;
            }
          }

            res.render('signupStats', { capco: capco, others: others });
        }
    });
};

/**
 * Activities of Users
 */
exports.activities = function(req, res, next) {
    User.find({}).exec(function(err, users) {
        if (err) {
          console.log(err);
            res.render('error', { errormsg: "Server error please try again later" });
        } else {
          res.jsonp(users);
        }
    });
};

exports.citUpdate = function(req, res) {
    User.find().exec(function(err, users) {
        if (err) {
            res.render('error', { errormsg: "Server error please try again later" });
        } else {
            var userCount = users.length;
            for (var i = 0; i < userCount; i++) {
                if (users[i].username.length == 4) {
                    updateUser(users[i]);
                }
            }
            res.end();
        }
    });
};

function updateUser(user) {
    citService.getUser(user.username, function(err, profile) {
        if (err) {
            console.log("Could not update: " + user.username);
        } else {
            user.name = profile.displayName;
            user.location = profile.location;
            user.level = profile.title;
            user.picName = profile.picName;

            user.save(function(err, newUser) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
};

/**
 * Add Manual Steps for a one off event
 */
exports.addManual = function(req, res) {

    if (!req.query.authcode || req.query.authcode !== "Wellbeing1") {
        res.render('error', { errormsg: "Manual event not added - Invalid Authorization Code" });
    } else {

        var user = new User();

        user.username = req.query.eventname;
        user.user_id = req.query.eventname;
        user.name = req.query.eventname;

        user.location = req.query.location;
        user.level = "Other";

        user.activities = [];
        user.totalSteps = req.query.steps;
        user.totalDistance = req.query.steps;
        user.totalDuration = req.query.steps;
        user.totalCalories = req.query.steps;

        user.save(function(err, newUser) {
            if (err) {
                console.log(err);
                if (err.code == 11000) {
                    res.render('error', { errormsg: "Manual event not added - Event Name has already been registered" });
                } else {
                    res.render('error', { errormsg: "Manual event not added - Server error please try again later" });
                }
            } else {
                console.log("Added " + newUser.totalSteps + " for " + newUser.username);
                res.render('success', {});
            }
        })
    }
};
