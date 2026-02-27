/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var cluster = require('cluster');
var User = mongoose.model('User');
var Location = mongoose.model('Location');
var config = require("../config/config");

const locationStatsDelay = 600000; // Wait 10 minutes to ensure individual FitBit and Strava updates are compelete

const callbackUrl = process.env.SERVER_URL ? `https://${process.env.SERVER_URL}/` : 'http://localhost/';

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
if (cluster.isMaster) {
    setTimeout(function(){
        if (process.env.UPDATE_INTERVAL) {
            // updateEveryInterval(process.env.UPDATE_INTERVAL);
        }
        else {
            // updateEveryInterval(60);
        }
    }, locationStatsDelay);
}

/**
 * List of Locations
 */
exports.list = function(req, res, next) {
    Location.find({}).select('name').sort('name')
        .then((locations) => {
            res.jsonp(locations);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * All Locations data
 */
exports.all = function(req, res, next) {

    // Get all the users first so we can include their real names etc.
    User.find({}).select('name _id location level totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalCycling totalCyclingConverted').sort({totalDistanceConverted: -1})
        .then((users) => {
            let userMap = [];
            users.forEach(function(user) {
                userMap[user._id] = user;
            });

            Location.find({})
                .then((locations) => {
                    locations.forEach(function(location) {
                        let updatedMembers = [];

                        location.members.forEach(function(member) {
                            if (userMap[member]) {
                                updatedMembers.push(userMap[member]);
                            }
                        });

                        location.members = updatedMembers;
                    });

                    res.jsonp(locations);
                }).catch((err) => {
                    res.render('error', { status: 500 });
                });
        }).catch((err) => {
            console.log("Data update error please try again later");
        });
};

function toSafeNumber(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function parsePositiveInt(value, fallback) {
    var parsed = parseInt(value, 10);
    if (Number.isNaN(parsed) || parsed <= 0) {
        return fallback;
    }
    return parsed;
}

/**
 * Office competition drill-down by employee
 */
exports.officeEmployees = function(req, res) {
    var locationName = req.params.location ? decodeURIComponent(req.params.location) : null;
    if (!locationName) {
        res.status(400).json({ error: 'Location is required' });
        return;
    }

    var page = parsePositiveInt(req.query.page, 1);
    var limit = Math.min(parsePositiveInt(req.query.limit, 25), 100);
    var sortBy = req.query.sortBy || 'totalDistanceConverted';
    var sortDirection = req.query.order && req.query.order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    var challengeFilter = req.query.challengeName;

    var allowedSortFields = {
        totalDistanceConverted: true,
        totalDistance: true,
        totalRun: true,
        totalWalk: true,
        totalCycling: true,
        totalCyclingConverted: true,
        totalYoga: true,
        totalSteps: true,
        totalDuration: true,
        totalCalories: true,
        name: true,
    };

    if (!allowedSortFields[sortBy]) {
        res.status(400).json({ error: 'Invalid sortBy field' });
        return;
    }

    var query = { location: locationName };
    if (challengeFilter) {
        query.challengeName = challengeFilter;
    }
    if (req.query.app) {
        query.app = req.query.app;
    }
    if (req.query.level) {
        query.level = req.query.level;
    }

    User.find(query)
        .select('name email app location country level team challengeName totalDistance totalDistanceConverted totalWalk totalRun totalSwim totalYoga totalCycling totalCyclingConverted totalDuration totalSteps totalCalories')
        .then((users) => {
            var employeeRows = users.map((user) => {
                var totalDistance = toSafeNumber(user.totalDistance);
                var totalDistanceConverted = toSafeNumber(user.totalDistanceConverted);
                var totalRun = toSafeNumber(user.totalRun);
                var totalWalk = toSafeNumber(user.totalWalk);
                var totalCycling = toSafeNumber(user.totalCycling);
                var totalCyclingConverted = toSafeNumber(user.totalCyclingConverted);
                var totalYoga = toSafeNumber(user.totalYoga);

                return {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    app: user.app,
                    location: user.location,
                    country: user.country,
                    level: user.level,
                    challengeName: user.challengeName,
                    totalDistance: totalDistance,
                    totalDistanceConverted: totalDistanceConverted,
                    totalRun: totalRun,
                    totalWalk: totalWalk,
                    totalCycling: totalCycling,
                    totalCyclingConverted: totalCyclingConverted,
                    totalYoga: totalYoga,
                    totalSwim: toSafeNumber(user.totalSwim),
                    totalDuration: toSafeNumber(user.totalDuration),
                    totalSteps: toSafeNumber(user.totalSteps),
                    totalCalories: toSafeNumber(user.totalCalories),
                    activityMix: {
                        runPct: totalDistanceConverted > 0 ? Math.round((totalRun / totalDistanceConverted) * 100) : 0,
                        walkPct: totalDistanceConverted > 0 ? Math.round((totalWalk / totalDistanceConverted) * 100) : 0,
                        cyclePct: totalDistanceConverted > 0 ? Math.round((totalCyclingConverted / totalDistanceConverted) * 100) : 0,
                        yogaPct: totalDistanceConverted > 0 ? Math.round((totalYoga / totalDistanceConverted) * 100) : 0,
                    }
                };
            });

            employeeRows.sort((a, b) => {
                var aValue = a[sortBy];
                var bValue = b[sortBy];

                if (sortBy === 'name') {
                    var compare = String(aValue || '').localeCompare(String(bValue || ''));
                    return sortDirection === 'asc' ? compare : (compare * -1);
                }

                var numericA = toSafeNumber(aValue);
                var numericB = toSafeNumber(bValue);
                if (sortDirection === 'asc') {
                    return numericA - numericB;
                }
                return numericB - numericA;
            });

            employeeRows = employeeRows.map((row, index) => ({
                rank: index + 1,
                ...row,
            }));

            var totalEmployees = employeeRows.length;
            var startIndex = (page - 1) * limit;
            var paginatedEmployees = employeeRows.slice(startIndex, startIndex + limit);

            var summary = employeeRows.reduce((accumulator, row) => {
                accumulator.totalDistance += row.totalDistance;
                accumulator.totalDistanceConverted += row.totalDistanceConverted;
                accumulator.totalRun += row.totalRun;
                accumulator.totalWalk += row.totalWalk;
                accumulator.totalCycling += row.totalCycling;
                accumulator.totalCyclingConverted += row.totalCyclingConverted;
                accumulator.totalYoga += row.totalYoga;
                accumulator.totalSteps += row.totalSteps;
                accumulator.totalDuration += row.totalDuration;
                accumulator.totalCalories += row.totalCalories;
                return accumulator;
            }, {
                totalDistance: 0,
                totalDistanceConverted: 0,
                totalRun: 0,
                totalWalk: 0,
                totalCycling: 0,
                totalCyclingConverted: 0,
                totalYoga: 0,
                totalSteps: 0,
                totalDuration: 0,
                totalCalories: 0,
            });

            var topPerformer = employeeRows.length > 0 ? {
                rank: employeeRows[0].rank,
                id: employeeRows[0].id,
                name: employeeRows[0].name,
                totalDistanceConverted: employeeRows[0].totalDistanceConverted,
            } : null;

            res.json({
                office: locationName,
                filters: {
                    challengeName: challengeFilter || null,
                    app: req.query.app || null,
                    level: req.query.level || null,
                },
                summary: {
                    totalEmployees: totalEmployees,
                    totalDistance: Math.round(summary.totalDistance * 100) / 100,
                    totalDistanceConverted: Math.round(summary.totalDistanceConverted * 100) / 100,
                    averageDistance: totalEmployees > 0 ? Math.round((summary.totalDistance / totalEmployees) * 100) / 100 : 0,
                    averageDistanceConverted: totalEmployees > 0 ? Math.round((summary.totalDistanceConverted / totalEmployees) * 100) / 100 : 0,
                    totalRun: Math.round(summary.totalRun * 100) / 100,
                    totalWalk: Math.round(summary.totalWalk * 100) / 100,
                    totalCycling: Math.round(summary.totalCycling * 100) / 100,
                    totalCyclingConverted: Math.round(summary.totalCyclingConverted * 100) / 100,
                    totalYoga: Math.round(summary.totalYoga * 100) / 100,
                    totalSteps: Math.round(summary.totalSteps),
                    totalDuration: Math.round(summary.totalDuration * 100) / 100,
                    totalCalories: Math.round(summary.totalCalories),
                    topPerformer: topPerformer,
                },
                pagination: {
                    page: page,
                    limit: limit,
                    total: totalEmployees,
                    totalPages: totalEmployees > 0 ? Math.ceil(totalEmployees / limit) : 1,
                    sortBy: sortBy,
                    order: sortDirection,
                },
                employees: paginatedEmployees,
            });
        }).catch((err) => {
            console.log('Error building office drill-down: ' + locationName + ', err: ' + err);
            res.status(500).json({ error: 'Server error please try again later' });
        });
};

/**
 * Refresh Location data every x minutes
 */
function updateEveryInterval(minutes) {

    console.log("Begin Location stats refresh every " + minutes + " minutes");
    var millis = minutes * 60 * 1000;

    setInterval(function(){

        User.find()
            .then((users) => {
                let userMap = [];
                users.forEach(function(user) {
                    userMap[user._id] = user;
                });

                Location.find()
                    .then((locations) => {
                        locations.forEach(function(location) {

                            if (!location.activities) {
                                location.activities = {};
                            }
    
                            location.activities.Walk = 0;
                            location.activities.Run = 0;
                            // location.activities.Swim = 0;
                            location.activities.Cycling = 0;
                            location.activities.CyclingConverted = 0;
                            // location.activities.Rowing = 0;
                            location.activities.Yoga = 0;
                            location.totalDistance = 0;
                            location.totalDistanceConverted = 0;
                            location.averageDistance = 0;
                            location.averageDistanceConverted = 0;
    
                            location.members.forEach(function(member) {
    
                                if (userMap[member]) {
                                    let teamMember = userMap[member];
                                    location.activities.Walk += teamMember.totalWalk;
                                    location.activities.Run += teamMember.totalRun;
                                    // location.activities.Swim += teamMember.totalSwim;
                                    location.activities.Cycling += teamMember.totalCycling;
                                    location.activities.CyclingConverted += teamMember.totalCyclingConverted;
                                    // location.activities.Rowing += teamMember.totalRowing;
                                    location.activities.Yoga += teamMember.totalYoga;
    
                                    location.totalDistance += teamMember.totalDistance;
                                    location.totalDistanceConverted += Math.round(teamMember.totalDistanceConverted);
                                }
                            });

                            location.averageDistance = Math.round(location.totalDistance / location.members.length);
                            location.averageDistanceConverted = Math.round(location.totalDistanceConverted / location.members.length);
    
                            location.markModified('activities');
                            location.markModified('totalDistance');
                            location.markModified('totalDistanceConverted');
                            location.markModified('averageDistance');
                            location.markModified('averageDistanceConverted');
    
                            location.save()
                                .then((updatedLocation) => {
                                }).catch((err) => {
                                    console.log("Error updating location stats: " + location.name + ", err: " + err);
                                });
                        });
    
                        console.log("All Location updates complete");
                    }).catch((err) => {
                        console.log("Error retrieving Location details");
                    });
            }).catch((err) => {
                console.log("Data update error please try again later");
            });
            
    }, millis);
}

/**
 * Add user to Location or create if it doesn't exist already
 */
 exports.AddOrUpdate = function(name, id) {

    if (!name) {
        console.log("Error adding unspecified location name");
        return;
    }

    if (!id) {
        console.log("Error adding unspecified user to location");
        return;
    }

    Location.findOne({name: name})
        .then((location) => {
            if (location && location.name) {
                console.log("Updating location: " + name);
                if (!location.members.includes(id)) {
                    location.members.push(id);
                    location.markModified('members');
                }
            } else {
                console.log("Creating location: " + name);
                location = new Location();
    
                location.name = name;
                location.members = [];
                location.members.push(id);
    
                location.activities = {};
    
                location.activities.Walk = 0;
                location.activities.Run = 0;
                // location.activities.Swim = 0;
                location.activities.Cycling = 0;
                location.activities.CyclingConverted = 0;
                // location.activities.Rowing = 0;
                location.activities.Yoga = 0;
                location.totalDistance = 0;
                location.totalDistanceConverted = 0;
                location.averageDistance = 0;
                location.averageDistanceConverted = 0;
            }
    
            location.save()
                .then((newLocation) => {
                }).catch((err) => {
                    console.log("Error creating location: " + location.name);
                    console.log(err);
                });

        }).catch((err) => {
            console.log("Error retrieving Location details for: " + name);
        });
};

/**
 * Remove member from a location
 */
exports.remove = function(user) {

    Location.findOne({name: user.location})
        .then((location) => {
            if (!location || locaion == null) {
                console.log("Error removing user from location: " + user.name + " - " + user.location);
            }
    
            const index = location.members.indexOf(user.name);
    
            if (index < 0) {
                console.log("Error removing user from location: " + user.name + " - " + user.location);
                return;
            }
    
            location.members.splice(index, 1);
            location.markModified('members');
                
            location.save()
                .then((updatedLocation) => {
                }).catch((err) => {
                    console.log("Error removing user from location: " + user.name + " - " + user.location);
                });

        }).catch((err) => {
            console.log("Error removing user from location: " + user.name + " - " + user.location);
        });
};
