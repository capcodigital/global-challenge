/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var config = require("../config/config");

const locationStatsDelay = 600000; // Wait 10 minutes to ensure individual FitBit and Strava updates are compelete

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    setTimeout(function(){
        if (process.env.UPDATE_INTERVAL) {
            updateEveryInterval(process.env.UPDATE_INTERVAL);
        }
        else {
            updateEveryInterval(60);
        }
    }, locationStatsDelay);
}

/**
 * List of Locations
 */
exports.list = function(req, res, next) {
    Location.find({}).select('name').sort('name').exec(function(err, locations) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(locations);
        }
    });
};

/**
 * All Locations data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name _id location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted').sort({totalDistanceConverted: -1}).exec(function(err, users) {
        if (err) {
            console.log("Data update error please try again later");
        } else {

            let userMap = [];
            users.forEach(function(user) {
                userMap[user._id] = user;
            });

            Location.find({}).exec(function(err, locations) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {

                    locations.forEach(function(location) {
                        let updatedMembers = [];

                        location.members.forEach(function(member) {
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
                        });

                        location.members = updatedMembers;
                    });

                    res.jsonp(locations);
                }
            });
        }
    });
};

/**
 * Refresh Location data every x minutes
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
                    userMap[user._id] = user;
                });

                Location.find().exec(function(err, locations) {

                    locations.forEach(function(location) {

                        if (!location.activities) {
                            location.activities = {};
                        }

                        location.activities.Walk = 0;
                        location.activities.Run = 0;
                        // location.activities.Swim = 0;
                        location.activities.Cycling = 0;
                        location.activities.CyclingConverted = 0;
                        // location.activities.Rowing = 0;
                        location.activities.Yoga = 0;
                        location.totalDistance = 0;
                        location.totalDistanceConverted = 0;

                        location.members.forEach(function(member) {

                            if (userMap[member]) {
                                let teamMember = userMap[member];
                                location.activities.Walk += teamMember.totalWalk;
                                location.activities.Run += teamMember.totalRun;
                                // location.activities.Swim += teamMember.totalSwim;
                                location.activities.Cycling += teamMember.totalCycling;
                                location.activities.CyclingConverted += teamMember.totalCyclingConverted;
                                // location.activities.Rowing += teamMember.totalRowing;
                                location.activities.Yoga += teamMember.totalYoga;

                                location.totalDistance += teamMember.totalDistance;
                                location.totalDistanceConverted += Math.round(teamMember.totalDistanceConverted);
                            }
                        });

                        location.markModified('activities');
                        location.markModified('totalDistance');
                        location.markModified('totalDistanceConverted');

                        location.save(function(err) {
                            if (err) {
                                console.log("Error updating location stats: " + location.name + ", err: " + err);
                            }
                        });
                    });

                    console.log("All Location updates complete");
                });
          }
      });
    }, millis);
}

/**
 * Add user to Location or create if it doesn't exist already
 */
 exports.AddOrUpdate = function(name, id) {

    if (!name) {
        console.log("Error adding unspecified location name");
        return;
    }

    if (!id) {
        console.log("Error adding unspecified user to location");
        return;
    }

    Location.findOne({
        name: name
    }).exec(function(err, location) {

        if (location && location.name) {
            console.log("Updating location: " + name);
            if (!location.members.includes(id)) {
                location.members.push(id);
                location.markModified('members');
            }
        } else {
            console.log("Creating location: " + name);
            location = new Location();

            location.name = name;
            location.members = [];
            location.members.push(id);

            location.activities = {};

            location.activities.Walk = 0;
            location.activities.Run = 0;
            // location.activities.Swim = 0;
            location.activities.Cycling = 0;
            location.activities.CyclingConverted = 0;
            // location.activities.Rowing = 0;
            location.activities.Yoga = 0;
            location.totalDistance = 0;
            location.totalDistanceConverted = 0; 
        }

        location.save(function(err) {
            if (err) {
                console.log("Error creating location: " + location.name);
                console.log(err);
            }
        });
    });
};

/**
 * Remove member from a location
 */
exports.remove = function(user) {

    Location.findOne({
        name: user.location
    }).exec(function(err, location) {
        if (err || !location || locaion == null) {
            console.log("Error removing user from location: " + user.name + " - " + user.location);
        }

        const index = location.members.indexOf(user.name);

        if (index < 0) {
            console.log("Error removing user from location: " + user.name + " - " + user.location);
            return;
        }

        location.members.splice(index, 1);
        location.markModified('members');
            
        location.save(function(err) {
            if (err) {
                console.log("Error removing user from location: " + user.name + " - " + user.location);
            }
        });
    });
};

