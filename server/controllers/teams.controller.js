/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var User = mongoose.model('User');

var callbackUrl = "capcoglobalchallenge.com"
if (process.env.NODE_ENV != "production") {
    callbackUrl = "localhost";
}

/**
 * List of Team names
 */
exports.list = function(req, res, next) {
    Team.find({}).select('name').sort('name').exec(function(err, users) {
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
 * Create a team
 */
exports.create = function(req, res) {

    User.findOne({
        username: req.body.captain
    }).exec(function(err, user) {
        if (err) res.send(400, { message: 'createTeamFailed'});
        if (!user) res.send(400, { message: 'createTeamFailedUserNotFound'});

        var team = new Team(req.body);

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

            team.members.push(req.body.member);
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

