/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var challenges = require('./challenges.controller');
var PreviousYear = mongoose.model('PreviousYear');

/**
* Use the current challenges dates to work out how far through the challenge we are
* and then look up and calculate the corresponding value from the last challenge
*/
exports.getLastYear = function(req, res) {
    challenges.getInProgressChallenge(function(challenge){
        let today = new Date();
        let hour = today.getHours();
        let dayNumber = 1;

        let dateAsString = challenge.startDate.toISOString().split('T')[0];
        let nextDate = new Date(dateAsString);

        while (!(nextDate.getDate() === today.getDate() && nextDate.getMonth() === today.getMonth())) {
            dayNumber++;
            nextDate.setDate(nextDate.getDate() + 1);
        }

        PreviousYear.find({day: dayNumber})
        .then((previousDay) => {
            let previousTotal = previousDay.cumulativeTotal + (perHour * hour);
            res.json({previousTotal: previousTotal});
        }).catch((err) => {
            res.json({error: "Server error please try again later"});
        });

    });
};
