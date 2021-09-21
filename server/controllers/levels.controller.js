/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var User = mongoose.model('User');
var Level = mongoose.model('Level');
var config = require("../config/config");

const levelStatsDelay = 300000; // Wait 5 minutes to ensure individual FitBit and Strava updates are compelete

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    setTimeout(function(){
        if (process.env.SERVER_URL) {
            updateEveryInterval(60);
        }
        else {
            updateEveryInterval(5);
        }
    }, levelStatsDelay);
}

/**
 * List of Levels
 */
exports.list = function(req, res, next) {
    Level.find({}).select('name').sort('name').exec(function(err, levels) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(levels);
        }
    });
};

/**
 * All Levels data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name username location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted totalRowing').exec(function(err, users) {
        if (err) {
            console.log("Data update error please try again later");
        } else {

            let userMap = [];
            users.forEach(function(user) {
                userMap[user.username] = user;
            });

            Level.find({}).exec(function(err, levels) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {

                    levels.forEach(function(level) {
                        let updatedMembers = [];

                        level.members.forEach(function(member) {
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
                        });

                        level.members = updatedMembers;
                    });

                    res.jsonp(levels);
                }
            });
        }
    });
};

/**
 * Refresh Level data every x minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin Level stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){

        User.find().exec(function(err, users) {
            if (err) {
                console.log("Data update error please try again later");
            } else {

                let userMap = [];
                users.forEach(function(user) {
                    userMap[user.username] = user;
                });

                Level.find().exec(function(err, levels) {

                    levels.forEach(function(level) {

                        if (!level.activities) {
                            level.activities = {};
                        }

                        level.activities.Walk = 0;
                        level.activities.Run = 0;
                        level.activities.Swim = 0;
                        level.activities.Cycling = 0;
                        level.activities.CyclingConverted = 0;
                        level.activities.Rowing = 0;
                        level.totalDistance = 0;
                        level.totalDistanceConverted = 0;

                        level.members.forEach(function(member) {

                            if (userMap[member]) {
                                level.activities.Walk += userMap[member].totalWalk;
                                level.activities.Run += userMap[member].totalRun;
                                level.activities.Swim += userMap[member].totalSwim;
                                level.activities.Cycling += userMap[member].totalCycling;
                                level.activities.CyclingConverted += userMap[member].totalCyclingConverted;
                                level.activities.Rowing += userMap[member].totalRowing;

                                level.totalDistance += userMap[member].totalDistance;
                                level.totalDistanceConverted += Math.round(userMap[member].totalDistanceConverted);
                            }
                        });

                        level.markModified('activities');
                        level.markModified('totalDistance');
                        level.markModified('totalDistanceConverted');

                        level.save(function(err) {
                            if (err) {
                                console.log("Error updating level stats: " + level.name);
                            }
                        });
                    });

                    console.log("All Level updates complete");
                });
          }
      });
    }, millis);
}

/**
 * Add user to Level or create if it doesn't exist already
 */
 exports.AddOrUpdate = function(name, userName) {

    Level.findOne({
        name: name
    }).exec(function(err, level) {

        if (level && location.name) {
            level.members.push(userName);
            level.markModified('members');
        } else {
            level = new Location();

            level.name = name;
            level.members = [];
            members.push(userName);

            level.activities = {};

            level.activities.Walk = 0;
            level.activities.Run = 0;
            level.activities.Swim = 0;
            level.activities.Cycling = 0;
            level.activities.CyclingConverted = 0;
            level.activities.Rowing = 0;
            level.totalDistance = 0;
            level.totalDistanceConverted = 0; 
        }

        level.save(function(err) {
            if (err) {
                console.log("Error creating level: " + level.name);
                console.log(err);
            }
        });
    });
};

/**
 * Remove member from a level
 */
exports.remove = function(user) {

    Level.findOne({
        name: user.level
    }).exec(function(err, level) {
        if (err || !level || level == null) {
            console.log("Error removing user from level: " + user.username + " - " + user.level);
        }

        const index = level.members.indexOf(user.username);

        if (index < 0) {
            console.log("Error removing user from level: " + user.username + " - " + user.level);
            return;
        }

        level.members.splice(index, 1);
        level.markModified('members');
            
        level.save(function(err) {
            if (err) {
                console.log("Error removing user from level: " + user.username + " - " + user.level);
            }
        });
    });
};

