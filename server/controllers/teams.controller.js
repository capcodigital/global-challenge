/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var Team = mongoose.model('Team');
var User = mongoose.model('User');
var mailer = require('../services/mail.service');
var config = require("../config/config");

const maxMembers = config.maxTeamSize - 1;
const minMembers = config.maxTeamSize - 1;

var callbackUrl = "35.227.237.141"
if (process.env.NODE_ENV != "production") {
    callbackUrl = "localhost";
}

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    updateEveryInterval(60);
}

/**
 * List of Team names
 */
exports.list = function(req, res, next) {
    Team.find({}).select('name').sort('name').exec(function(err, teams) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(teams);
        }
    });
};

/**
 * All Team data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name username location level totalDistance totalWalk totalRun totalSwim totalCycling totalRowing').exec(function(err, users) {
        if (err) {
            console.log("Data update error please try again later");
        } else {

            let userMap = [];
            users.forEach(function(user) {
                userMap[user.username] = user;
            });

            Team.find({}).exec(function(err, teams) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {

                    teams.forEach(function(team) {
                        let updatedMembers = [];

                        team.members.forEach(function(member) {
                            updatedMembers.push(userMap[member]);
                        });

                        team.members = updatedMembers;
                    });

                    res.jsonp(teams);
                }
            });
        }
    });
};

/**
 * Create a team
 */
exports.create = function(req, res) {

    User.findOne({
        username: req.body.captain
    }).exec(function(err, user) {
        if (err) res.send(400, { message: 'createTeamFailed'});
        if (!user) res.send(400, { message: 'createTeamFailedUserNotFound'});

        var team = new Team(req.body);
        if (!team.members.includes(team.captain)) {
            team.members.push(team.captain);
        }

        if (team.members.length < minMembers) res.send(400, { message: 'createTeamFailedTooFewPeople'});
        if (team.members.length > maxMembers) res.send(400, { message: 'createTeamFailedTooManyPeople'});

        team.save(function(err) {
            if (err) {
                console.log("Error creating team: " + team.name);
                res.send(400, { message: 'createTeamFailed'});
            } else {
                res.jsonp(team);
            }
        });
    });
};

/**
 * Update a team
 */
exports.update = function(req, res) {

    User.findOne({
        username: req.body.member
    }).exec(function(err, user) {
        if (err) res.send(400, { message: 'joinTeamFailed'});
        if (!user) res.send(400, { message: 'joinTeamFailedUserNotFound'});
    
        Team.findOne({
            name: req.body.team
        }).exec(function(err, team) {
            if (err) res.send(400, { message: 'joinTeamFailed'});
            if (!team) res.send(400, { message: 'joinTeamFailed'});
            if (team == null) res.send(400, { message: 'joinTeamFailed'});

            if (team.members.includes(req.body.member)) res.send(400, { message: 'joinTeamFailedAlreadyAMember'});
            if (team.members.length > maxMembers) res.send(400, { message: 'joinTeamFailedTooManyPeople'});

            team.members.push(req.body.member);
            team.markModified('members');
                
            team.save(function(err) {
                if (err) {
                    console.log("Error joining team: " + team.name);
                    res.send(400, { message: 'joinTeamFailed'});
                } else {

                    // User.findOne({
                    //     username: team.captain
                    // }).exec(function(err, captain) {
                    //     let emailText = "Hello " + captain.name + "\n\r" + user.name + " has applied to join your team " + team.name;

                    //     mailer.sendMail(captain.email, "New Capco Challenge Team Member", emailText, function() {
                    //         console.log("email sent to " + captain.email);
                    //     });
                    // });

                    res.jsonp(team);
                }
            });
        });
    });
};

/**
 * Remove member from a team
 */
exports.remove = function(req, res) {

    User.findOne({
        username: req.body.member
    }).exec(function(err, user) {
        if (err) res.send(400, { message: 'removeFromTeamFailed'});
        if (!user) res.send(400, { message: 'removeFromTeamFailedUserNotFound'});
    
        Team.findOne({
            name: req.body.team
        }).exec(function(err, team) {
            if (err) res.send(400, { message: 'removeFromTeamFailed'});
            if (!team) res.send(400, { message: 'removeFromTeamFailed'});
            if (team == null) res.send(400, { message: 'removeFromTeamFailed'});

            const index = team.members.indexOf(req.body.member);

            if (index < 0) {
                res.send(400, { message: 'removeFromTeamFailedNotAMember'});
            }

            team.members.splice(index, 1);
            team.markModified('members');
                
            team.save(function(err) {
                if (err) {
                    console.log("Error joining team: " + team.name);
                    res.send(400, { message: 'joinTeamFailed'});
                } else {
                    res.jsonp(team);
                }
            });
        });
    });
};

/**
 * Refresh Team data every x minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin Team stats refresh every " + minutes + " minutes");
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

                Team.find().exec(function(err, teams) {

                    teams.forEach(function(team) {

                        team.activities.Walk = 0;
                        team.activities.Run = 0;
                        team.activities.Swim = 0;
                        team.activities.Cycling = 0;
                        team.activities.CyclingConverted = 0;
                        team.activities.Rowing = 0;
                        team.totalDistance = 0;
                        team.totalDistanceConverted = 0;

                        team.members.forEach(function(member) {
                            team.activities.Walk += userMap[member].totalWalk;
                            team.activities.Run += userMap[member].totalRun;
                            team.activities.Swim += userMap[member].totalSwim;
                            team.activities.Cycling += userMap[member].totalCycling;
                            team.activities.CyclingConverted += userMap[member].totalCyclingConverted;
                            team.activities.Rowing += userMap[member].totalRowing;

                            team.totalDistance += userMap[member].totalDistance;
                            team.totalDistanceConverted += userMap[member].totalDistanceConverted;
                        });

                        team.markModified('activities');
                        team.markModified('totalDistance');
                        team.markModified('totalDistanceConverted');

                        team.save(function(err) {
                            if (err) {
                                console.log("Error updating team stats: " + team.name);
                            }
                        });
                    });

                    console.log("All Team updates complete");
                });
          }
      });
    }, millis);
}

