/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var User = mongoose.model('User');
var Level = mongoose.model('Level');
var config = require("../config/config");

const levelStatsDelay = 600000; // Wait 10 minutes to ensure individual FitBit and Strava updates are compelete

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    setTimeout(function(){
        if (process.env.UPDATE_INTERVAL) {
            // updateEveryInterval(process.env.UPDATE_INTERVAL);
        }
        else {
            // updateEveryInterval(60);
        }
    }, levelStatsDelay);
}

/**
 * List of Levels
 */
exports.list = function(req, res, next) {
    Level.find({}).select('name').sort('name')
        .then((levels) => {
            res.jsonp(levels);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * All Levels data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name _id location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted').sort({totalDistanceConverted: -1})
        .then((users) => {
            let userMap = [];
            users.forEach(function(user) {
                userMap[user._id] = user;
            });

            Level.find({})
                .then((levels) => {
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
                }).catch((err) => {
                    res.render('error', { status: 500 });
                });
        }).catch((err) => {
            console.log("Data update error please try again later");
        });
};

/**
 * Refresh Level data every x minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin Level stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){

        User.find()
            .then((users) => {
                let userMap = [];
                users.forEach(function(user) {
                    userMap[user._id] = user;
                });

                Level.find()
                    .then((levels) => {
                        levels.forEach(function(level) {

                            if (!level.activities) {
                                level.activities = {};
                            }
    
                            level.activities.Walk = 0;
                            level.activities.Run = 0;
                            // level.activities.Swim = 0;
                            level.activities.Cycling = 0;
                            level.activities.CyclingConverted = 0;
                            // level.activities.Rowing = 0;
                            level.activities.Yoga = 0;
                            level.totalDistance = 0;
                            level.totalDistanceConverted = 0;
    
                            level.members.forEach(function(member) {
    
                                if (userMap[member]) {
                                    let teamMember = userMap[member];
                                    level.activities.Walk += teamMember.totalWalk;
                                    level.activities.Run += teamMember.totalRun;
                                    // level.activities.Swim += teamMember.totalSwim;
                                    level.activities.Cycling += teamMember.totalCycling;
                                    level.activities.CyclingConverted += teamMember.totalCyclingConverted;
                                    // level.activities.Rowing += teamMember.totalRowing;
                                    level.activities.Yoga += teamMember.totalYoga;
    
                                    level.totalDistance += teamMember.totalDistance;
                                    level.totalDistanceConverted += Math.round(teamMember.totalDistanceConverted);
                                }
                            });
    
                            level.markModified('activities');
                            level.markModified('totalDistance');
                            level.markModified('totalDistanceConverted');
    
                            level.save()
                                .then((updatedLevel) => {
                                }).catch((err) => {
                                    console.log("Error updating level stats: " + level.name + ", err: " + err);
                                });
                        });
    
                        console.log("All Level updates complete");
                    }).catch((err) => {
                        console.log("Error retrieving Level details");
                    });
            }).catch((err) => {
                console.log("Data update error please try again later");
            });

    }, millis);
}

/**
 * Add user to Level or create if it doesn't exist already
 */
 exports.AddOrUpdate = function(name, id) {

    if (!name) {
        console.log("Error adding unspecified level name");
        return;
    }

    if (!id) {
        console.log("Error adding unspecified user to level");
        return;
    }

    Level.findOne({name: name})
        .then((level) => {
            if (level && level.name) {
                console.log("Updating level: " + name);
                if (!level.members.includes(id)) {
                    level.members.push(id);
                    level.markModified('members');
                }
            } else {
                console.log("Creating level: " + name);
                level = new Level();
    
                level.name = name;
                level.members = [];
                level.members.push(id);
    
                level.activities = {};
    
                level.activities.Walk = 0;
                level.activities.Run = 0;
                // level.activities.Swim = 0;
                level.activities.Cycling = 0;
                level.activities.CyclingConverted = 0;
                // level.activities.Rowing = 0;
                level.activities.Yoga = 0;
                level.totalDistance = 0;
                level.totalDistanceConverted = 0; 
            }
    
            level.save()
                .then((newLevel) => {
                }).catch((err) => {
                    console.log("Error creating level: " + level.name);
                    console.log(err);
                });

        }).catch((err) => {
            console.log("Error retrieving Level details for: " + name);
        });
};

/**
 * Remove member from a level
 */
exports.remove = function(user) {

    Level.findOne({name: user.level})
        .then((level) => {
            if (!level || level == null) {
                console.log("Error removing user from level: " + user.name + " - " + user.level);
            }
    
            const index = level.members.indexOf(user.name);
    
            if (index < 0) {
                console.log("Error removing user from level: " + user.name + " - " + user.level);
                return;
            }
    
            level.members.splice(index, 1);
            level.markModified('members');
                
            level.save()
                .then((updatedLevel) => {
                }).catch((err) => {
                    console.log("Error removing user from level: " + user.name + " - " + user.level);
                });

        }).catch((err) => {
            console.log("Error removing user from level: " + user.name + " - " + user.level);
        });
};

