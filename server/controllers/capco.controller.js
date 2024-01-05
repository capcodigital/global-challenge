/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Capco = mongoose.model('Capco');

/**
 * List all Capco Employees
 */
 exports.list = function(req, res, next) {
    Level.find({}).select('name').sort('name')
        .then((capcoites) => {
            res.jsonp(capcoites);
        }).catch((err) => {
            res.render('error', { status: 500 });
        });
};

/**
 * Add Capco Employee
 */
 exports.create = function(employee) {

        let capcoite = new Capco();

        capcoite.name = employee.name;
        capcoite.email = employee.email;
        capcoite.location = employee.location;
        capcoite.level = employee.level;

        capcoite.save()
            .then((newCapcoite) => {
            }).catch((err) => {
                console.log("Error creating capcoite: " + capcoite.name);
                console.log(err);
            });
};