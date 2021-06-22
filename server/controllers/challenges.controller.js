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
 * Get dates for current challenge
 */
exports.getCurrentChallengeDates = function(cb) {
    Challenge.findOne({
        status: 'In Progress'
    }).exec(function(err, challenge) {
        if (err) {
            return [];
        } else {
            let dates = [];
            let dateAsString = challenge.startDate.toISOString().split('T')[0];
            dates.push(dateAsString);

            if (dateAsString.charAt(5) === '0' || dateAsString.charAt(8) === '0') {
                dateAsString = dateAsString.replace(/\-0/g, '-');
                dates.push(dateAsString);
            }

            let nextDate = new Date();
            nextDate.setDate(challenge.startDate.getDate() + 1);

            while (nextDate.getDate() !== challenge.endDate.getDate()) {
                dateAsString = nextDate.toISOString().split('T')[0];
                dates.push(dateAsString);
                if (dateAsString.charAt(5) === '0' || dateAsString.charAt(8) === '0') {
                    dateAsString = dateAsString.replace(/\-0/g, '-');
                    dates.push(dateAsString);
                }
                nextDate.setDate(nextDate.getDate() + 1);
            }

            dateAsString = challenge.endDate.toISOString().split('T')[0];
            dates.push(dateAsString);

            if (dateAsString.charAt(5) === '0' || dateAsString.charAt(8) === '0') {
                dateAsString = dateAsString.replace(/\-0/g, '-');
                dates.push(dateAsString);
            }

            cb(dates);
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

