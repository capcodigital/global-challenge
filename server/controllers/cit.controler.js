/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Audit = mongoose.model('Audit'),
    citService = require('../services/cit'),
    _ = require('underscore');

/**
 * Save a new record in the Audit Log
 */
function saveNewAudit(auditRecord) {
    auditRecord.visualization = 'Project';
    auditRecord.save(function(err) {
        if (err) {
            console.log(err);
        }
    });
}

/**
 * List of Users
 */
exports.all = function(req, res) {
    citService.getAllUsers(function(err, result) {
        if (err) {
            console.log(err);
            res.json({error: {status: 500}});
        } else {
            res.jsonp(result.content);
        }
    });
}

/**
 * Get one user
 */
 exports.me = function(req, res) {
    var capcoId = req.params.capcoId;

    citService.getUser(capcoId, function(err, result) {
        if (err) {
            console.log(err);
            res.json({error: {status: 500}});
        } else {
            res.jsonp(result);
        }
    });
}

exports.getPhoto = function(req, res) {
    // This needs to be numeric user id not Capco 4 letter id
    var capcoId = req.params.capcoId;

    citService.getUserPhoto(capcoId, function(err, result) {
        if (err) {
            console.log(err);
            res.json({error: {status: 500}});
        } else {
            res.setHeader('Content-Type', result.type);
            res.setHeader('Content-Length', result.length);
            res.end(result.photo);
        }
    });
}

