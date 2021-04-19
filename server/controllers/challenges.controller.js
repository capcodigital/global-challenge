/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');
var User = mongoose.model('User');

/**
 * List all Challenges
 */
exports.list = function(req, res, next) {
    Challenge.find({}).exec(function(err, users) {
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
 * Get specific challenge
 */
exports.get = function(req, res, next) {
    Challenge.findOne({
        name: req.body.name
    }).exec(function(err, challenge) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(challenge);
        }
    });
};

/**
 * Create a challenge
 */
exports.create = function(req, res) {

    User.findOne({
        username: req.body.owner
    }).exec(function(err, user) {
        if (err) return res.send(401, 'Error creating challenge');
        if (!user) return res.send(401, 'Owner not reqcognised');

        var challenge = new Challenge(req.body);

        challenge.save(function(err) {
            if (err) {
                console.log("Error creating challenge: " + challenge.name);
            } else {
                res.jsonp(challenge);
            }
        });
    });
};

/**
 * Update a challenge
 */
exports.update = function(req, res) {

    Challenge.findOne({
        name: req.body.challenge
    }).exec(function(err, challenge) {
        if (err || !challenge) return res.send(401, 'Challenge not found');

        challenge = req.body;
            
        challenge.save(function(err) {
            if (err) {
                console.log("Error saving challenge: " + challenge.name);
            } else {
                res.jsonp(challenge);
            }
        });
    });
};

