/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var challenges = require('./challenges.controller');
var Previousyear = mongoose.model('Previousyear');

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
        console.log("dateAsString: " + dateAsString);
        let nextDate = new Date(dateAsString);
        console.log("nextDate: " + nextDate);

        while (!(nextDate.getDate() === today.getDate() && nextDate.getMonth() === today.getMonth())) {
            dayNumber++;
            nextDate.setDate(nextDate.getDate() + 1);
        }

        console.log("dayNumber: " + dayNumber);
        Previousyear.findOne({day: dayNumber})
        .then((previousDay) => {
            if (!previousDay || previousDay == null) {
                console.log("Previous Year data not found");
                res.json({error: "Server error please try again later"});
            } else {
                let previousTotal = previousDay ? (previousDay.cumulativeTotal + (previousDay.perHour * hour)) : 0;
                res.json({previousTotal: previousTotal});
            }
        }).catch((err) => {
            console.log("Previous Year Error: " + err);
            res.json({error: "Server error please try again later"});
        });

    });
};
