/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var Team = mongoose.model('Team');
var User = mongoose.model('User');
var mailer = require('../services/mail.service');
var config = require("../config/config");

const maxMembers = config.maxTeamSize;
const minMembers = config.minTeamSize;
const teamStatsDelay = 300000; // Wait 5 minutes to ensure individual FitBit and Strava updates are compelete

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
    }, teamStatsDelay);
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
    User.find({}).select('name username location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted totalRowing').exec(function(err, users) {
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
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
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
 * All Team data
 */
exports.teamMembers = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name username location level').exec(function(err, users) {
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
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
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
 * All Team data
 */
exports.notInATeam = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name username location level').exec(function(err, users) {
        if (err) {
            console.log("Data update error please try again later");
        } else {

            Team.find({}).exec(function(err, teams) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {

                    let usersInTeam = [];
                    teams.forEach(function(team) {
                        
                        usersInTeam[team.captain] = team.captain;
                        team.members.forEach(function(member) {
                            usersInTeam[member] = member;
                        });
                    });

                    let notInATeam = [];
                    users.forEach(function(user) {
                        if (!usersInTeam[user]) {
                            notInATeam.push(user);
                        }
                    });

                    res.jsonp(notInATeam);
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
        if (err) {
            res.status(400).send({ message: 'createTeamFailed'});
            return;
        }
        if (!user) { 
            res.status(400).send({ message: 'createTeamFailedUserNotFound'});
            return;
        }

        var team = new Team(req.body);
        if (!team.members.includes(team.captain)) {
            team.members.push(team.captain);
        }

        if (team.members.length < minMembers) {
            console.log("Min Fail");
            res.status(400).send({ message: 'createTeamFailedTooFewPeople'});
            return;
        }
        if (team.members.length > maxMembers) {
            console.log("Max Fail");
            res.status(400).send({ message: 'createTeamFailedTooManyPeople'});
            return;
        }

        team.activities = {};

        team.activities.Walk = 0;
        team.activities.Run = 0;
        team.activities.Swim = 0;
        team.activities.Cycling = 0;
        team.activities.CyclingConverted = 0;
        team.activities.Rowing = 0;
        team.totalDistance = 0;
        team.totalDistanceConverted = 0;

        team.save(function(err) {
            if (err) {
                if (err.code == 11000) {
                    console.log("Duplicate team: " + team.name);
                    console.log(err);
                    res.status(400).send({ message: 'createTeamDuplicate'});
                } else {
                    console.log("Error creating team: " + team.name);
                    console.log(err);
                    res.status(400).send({ message: 'createTeamFailed'});
                }
            } else {
                User.find({
                    username: { $in: req.body.members }
                }).exec(function(err, users) {
                    let emailText = "Hello " + user.name + ",\n\r Your team - " + team.name + " has been successfully created with the following members: \n\r";

                    for (var i = 0; i < users.length; i++) {
                        emailText = emailText + users[i].name  + "\n";
                        emailTeamMember(users[i], team);
                    }
                    emailText = emailText + "\n\r Good Luck with the Challenge \n\r Capco Health & Wellbeing";

                    mailer.sendMail(user.email, "Capco Challenge Team Successfully Created", emailText, function() {
                        console.log("email sent to " + user.email);
                    });
                });

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
        if (err) {
            res.status(400).send({ message: 'joinTeamFailed'});
            return;
        }
        if (!user) { 
            res.status(400).send({ message: 'joinTeamFailedUserNotFound'});
            return;
        }
    
        Team.findOne({
            name: req.body.team
        }).exec(function(err, team) {
            if (err) { 
                res.status(400).send({ message: 'joinTeamFailed'});
                return;
            }
            if (!team) { 
                res.status(400).send({ message: 'joinTeamFailed'});
                return;
            }
            if (team == null) { 
                res.status(400).send({ message: 'joinTeamFailed'});
                return
            }

            if (team.members.includes(req.body.member)) { 
                res.status(400).send({ message: 'joinTeamFailedAlreadyAMember'});
                return;
            }
            if (team.members.length >= maxMembers) {
                res.status(400).send({ message: 'joinTeamFailedTooManyPeople'});
                return;
            }

            team.members.push(req.body.member);
            team.markModified('members');
                
            team.save(function(err) {
                if (err) {
                    console.log("Error joining team: " + team.name);
                    res.send(400, { message: 'joinTeamFailed'});
                } else {
                    emailTeamMember(user, team);

                    User.findOne({
                        username: team.captain
                    }).exec(function(err, captain) {
                        let emailText = "Hello " + captain.name + ",\n\r" + user.name + " has joined your team: " + team.name + 
                        "\n\r Good Luck with the Challenge \n\r Capco Health & Wellbeing";

                        mailer.sendMail(captain.email, "New Capco Challenge Team Member", emailText, function() {
                            console.log("email sent to " + captain.email);
                        });
                    });

                    res.jsonp(team);
                }
            });
        });
    });
};

function emailTeamMember(user, team) {
    let memberEmailText = "Hello " + user.name + ",\n\r You have been added to the team - " + team.name + " for the Capco Global Challenge.\n\r" +
                        "If you wish to remove yourself from this team please click the following link: \n\r" +
                        callbackUrl + "teams/remove?team=" + team._id + "&member=" + user._id + "\n\r Good Luck with the Challenge \n\r" +
                        "Capco Health & Wellbeing";

    mailer.sendMail(user.email, "Joined Capco Global Challenge Team", memberEmailText, function() {
        console.log("email sent to " + user.email);
    });
}

/**
 * Remove member from a team
 */
 exports.remove = function(req, res) {

    Team.findOne({
        name: req.body.team
    }).exec(function(err, team) {
        if (err) { 
            res.send(400, { message: 'removeFromTeamFailed'});
            return;
        }
        if (!team) {
            res.send(400, { message: 'removeFromTeamFailed'});
            return;
        }
        if (team == null) {
            res.send(400, { message: 'removeFromTeamFailed'});
            return;
        }

        const index = team.members.indexOf(req.body.member);

        if (index < 0) {
            res.send(400, { message: 'removeFromTeamFailedNotAMember'});
            return;
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
};

/**
 * Remove member from a team
 */
exports.removeById = function(req, res) {

    Team.findOne({
        _id: mongoose.Types.ObjectId(req.query.team)
    }).exec(function(err, team) {
        if (err) { 
            res.send(400, { message: "Unable to remove user from team"});
            return;
        }
        if (!team) {
            res.send(400, { message: "Unable to remove user from team"});
            return;
        }
        if (team == null) {
            res.send(400, { message: "Unable to remove user from team"});
            return;
        }

        console.log(req.query.member);

        User.findOne({
            _id: mongoose.Types.ObjectId(req.query.member)
        }).exec(function(err, user) {
            let errorMessage = "Unable to remove user from team " + team.name;
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

            const index = team.members.indexOf(user.username);
            errorMessage = "Unable to remove " + user.name + " from team " + team.name;

            if (index < 0) {
                res.send(400, { message: errorMessage});
                return;
            }

            team.members.splice(index, 1);
            team.markModified('members');
                
            team.save(function(err) {
                if (err) {
                    console.log(errorMessage);
                    res.send(400, { message: errorMessage});
                } else {
                    res.send(200, {message: 'Successfully removed from Team'});
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

                        if (!team.activities) {
                            team.activities = {};
                        }

                        team.activities.Walk = 0;
                        team.activities.Run = 0;
                        team.activities.Swim = 0;
                        team.activities.Cycling = 0;
                        team.activities.CyclingConverted = 0;
                        team.activities.Rowing = 0;
                        team.totalDistance = 0;
                        team.totalDistanceConverted = 0;

                        team.members.forEach(function(member) {
                            if (userMap[member]) {
                                team.activities.Walk += userMap[member].totalWalk;
                                team.activities.Run += userMap[member].totalRun;
                                team.activities.Swim += userMap[member].totalSwim;
                                team.activities.Cycling += userMap[member].totalCycling;
                                team.activities.CyclingConverted += userMap[member].totalCyclingConverted;
                                team.activities.Rowing += userMap[member].totalRowing;

                                team.totalDistance += userMap[member].totalDistance;
                                team.totalDistanceConverted += Math.round(userMap[member].totalDistanceConverted);
                            }
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

