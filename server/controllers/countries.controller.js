/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var User = mongoose.model('User');
var Country = mongoose.model('Country');
var config = require("../config/config");

const countryStatsDelay = 600000; // Wait 10 minutes to ensure individual FitBit and Strava updates are compelete

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
    }, countryStatsDelay);
}

/**
 * List of Countries
 */
exports.list = function(req, res, next) {
    Country.find({}).select('name').sort('name')
        .then((countries) => {
            res.jsonp(countries);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * All Countries data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name _id country level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted').sort({totalDistanceConverted: -1})
        .then((users) => {
            let userMap = [];
            users.forEach(function(user) {
                userMap[user._id] = user;
            });

            Country.find({})
                .then((countries) => {
                    countries.forEach(function(country) {
                        let updatedMembers = [];

                        country.members.forEach(function(member) {
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
                        });

                        country.members = updatedMembers;
                    });

                    res.jsonp(countries);
                }).catch((err) => {
                    res.render('error', { status: 500 });
                });
        }).catch((err) => {
            console.log("Data update error please try again later");
        });
};

/**
 * Refresh Country data every x minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin Country stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){

        User.find()
            .then((users) => {
                let userMap = [];
                users.forEach(function(user) {
                    userMap[user._id] = user;
                });

                Country.find()
                    .then((countries) => {
                        countries.forEach(function(country) {

                            if (!country.activities) {
                                country.activities = {};
                            }
    
                            country.activities.Walk = 0;
                            country.activities.Run = 0;
                            // country.activities.Swim = 0;
                            country.activities.Cycling = 0;
                            country.activities.CyclingConverted = 0;
                            // country.activities.Rowing = 0;
                            country.activities.Yoga = 0;
                            country.totalDistance = 0;
                            country.totalDistanceConverted = 0;
                            country.averageDistance = 0;
                            country.averageDistanceConverted = 0;
    
                            country.members.forEach(function(member) {
    
                                if (userMap[member]) {
                                    let teamMember = userMap[member];
                                    country.activities.Walk += teamMember.totalWalk;
                                    country.activities.Run += teamMember.totalRun;
                                    // country.activities.Swim += teamMember.totalSwim;
                                    country.activities.Cycling += teamMember.totalCycling;
                                    country.activities.CyclingConverted += teamMember.totalCyclingConverted;
                                    // country.activities.Rowing += teamMember.totalRowing;
                                    country.activities.Yoga += teamMember.totalYoga;
    
                                    country.totalDistance += teamMember.totalDistance;
                                    country.totalDistanceConverted += Math.round(teamMember.totalDistanceConverted);
                                }
                            });

                            country.averageDistance = Math.round(country.totalDistance / country.members.length);
                            country.averageDistanceConverted = Math.round(country.totalDistanceConverted / country.members.length);
    
                            country.markModified('activities');
                            country.markModified('totalDistance');
                            country.markModified('totalDistanceConverted');
                            country.markModified('averageDistance');
                            country.markModified('averageDistanceConverted');
    
                            country.save()
                                .then((updatedLocation) => {
                                }).catch((err) => {
                                    console.log("Error updating country stats: " + country.name + ", err: " + err);
                                });
                        });
    
                        console.log("All Country updates complete");
                    }).catch((err) => {
                        console.log("Error retrieving Country details");
                    });
            }).catch((err) => {
                console.log("Data update error please try again later");
            });
            
    }, millis);
}

/**
 * Add user to Country or create if it doesn't exist already
 */
 exports.AddOrUpdate = function(name, id) {

    if (!name) {
        console.log("Error adding unspecified country name");
        return;
    }

    if (!id) {
        console.log("Error adding unspecified user to country");
        return;
    }

    Country.findOne({name: name})
        .then((country) => {
            if (country && country.name) {
                console.log("Updating country: " + name);
                if (!country.members.includes(id)) {
                    country.members.push(id);
                    country.markModified('members');
                }
            } else {
                console.log("Creating country: " + name);
                country = new Country();
    
                country.name = name;
                country.members = [];
                country.members.push(id);
    
                country.activities = {};
    
                country.activities.Walk = 0;
                country.activities.Run = 0;
                // country.activities.Swim = 0;
                country.activities.Cycling = 0;
                country.activities.CyclingConverted = 0;
                // country.activities.Rowing = 0;
                country.activities.Yoga = 0;
                country.totalDistance = 0;
                country.totalDistanceConverted = 0;
                country.averageDistance = 0;
                country.averageDistanceConverted = 0;
            }
    
            country.save()
                .then((newLocation) => {
                }).catch((err) => {
                    console.log("Error creating country: " + country.name);
                    console.log(err);
                });

        }).catch((err) => {
            console.log("Error retrieving Country details for: " + name);
        });
};

/**
 * Remove member from a country
 */
exports.remove = function(user) {

    Country.findOne({name: user.country})
        .then((country) => {
            if (!country || locaion == null) {
                console.log("Error removing user from country: " + user.name + " - " + user.country);
            }
    
            const index = country.members.indexOf(user.name);
    
            if (index < 0) {
                console.log("Error removing user from country: " + user.name + " - " + user.country);
                return;
            }
    
            country.members.splice(index, 1);
            country.markModified('members');
                
            country.save()
                .then((updatedLocation) => {
                }).catch((err) => {
                    console.log("Error removing user from country: " + user.name + " - " + user.country);
                });

        }).catch((err) => {
            console.log("Error removing user from country: " + user.name + " - " + user.country);
        });
};

