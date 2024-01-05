/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');
var User = mongoose.model('User');

const challengeName = process.env.CHALLENGE_NAME ? `${process.env.CHALLENGE_NAME}` : 'dev';

/**
 * List all Challenges
 */
exports.list = function(req, res, next) {
    Challenge.find({})
        .then((users) => {
            res.jsonp(users);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * Get specific challenge
 */
exports.get = function(req, res, next) {
    Challenge.findOne({name: req.body.name})
        .then((challenge) => {
            res.jsonp(challenge);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * Get dates for current challenge
 */
exports.getCurrentChallengeDates = function(cb) {
    Challenge.findOne({status: 'In Progress', challengeName: challengeName})
    .then((challenge) => {
        let dates = [];
            let dateAsString = challenge.startDate.toISOString().split('T')[0];
            dates.push(dateAsString);

            let nextDate = new Date(dateAsString);
            nextDate.setDate(challenge.startDate.getDate() + 1);

            while (!(nextDate.getDate() === challenge.endDate.getDate() && nextDate.getMonth() === challenge.endDate.getMonth())) {
                dateAsString = nextDate.toISOString().split('T')[0];
                dates.push(dateAsString);
                nextDate.setDate(nextDate.getDate() + 1);
            }

            dateAsString = challenge.endDate.toISOString().split('T')[0];
            dates.push(dateAsString);

            cb(dates);
    }).catch((err) => {
        return [];
    })
};

/**
 * Create a challenge
 */
exports.create = function(req, res) {

    User.findOne({_id: mongoose.Types.ObjectId(req.body.owner)})
        .then((user) => {
            if (!user) return res.send(401, 'Owner not reqcognised');

            var challenge = new Challenge(req.body);

            challenge.save(function(err) {
                if (err) {
                    console.log("Error creating challenge: " + challenge.name);
                } else {
                    res.jsonp(challenge);
                }
            });

        }).catch((err) => {
            return res.send(401, 'Error creating challenge');
        });
};

/**
 * Update a challenge
 */
exports.update = function(req, res) {

    Challenge.findOne({name: req.body.challenge})
        .then((challenge) => {
            if (!challenge) return res.send(401, 'Challenge not found');

            challenge = req.body;
            
            challenge.save(function(err) {
                if (err) {
                    console.log("Error saving challenge: " + challenge.name);
                } else {
                    res.jsonp(challenge);
                }
            });
        }).catch((err) => {
            return res.send(401, 'Challenge not found');
        });
};

