/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var User = mongoose.model('User');

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
        if (err) return res.send(401, 'Error creating team');
        if (!user) return res.send(401, 'User not registered');

        var team = new Team(req.body);

        team.save(function(err) {
            if (err) {
                console.log("Error creating team: " + team.name);
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
        if (err) return res.send(401, 'Error joining team');
        if (!user) return res.send(401, 'User not registered');
    
        Team.findOne({
            name: req.body.team
        }).exec(function(err, team) {
            if (err || !team) return res.send(401, 'Error Joining Team');

            team.members.push(req.body.member);
            team.markModified('members');
                
            team.save(function(err) {
                if (err) {
                    console.log("Error saving team: " + team.name);
                } else {
                    res.jsonp(team);
                }
            });
        });
    });
};

