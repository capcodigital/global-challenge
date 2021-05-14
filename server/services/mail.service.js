/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer'),
    path = require('path');

var DEFAULT_FROM_ADDRESS = "challenge@capco.com";

var cgcTransport = nodemailer.createTransport({
    host: 'localhost',
    post: 25,
    secure: false,
    // auth:{
    //     user:'challenge@capco.co.uk',
    //     pass:'CGCESTR123'
    // }
    tls: {
      rejectUnauthorized: false
    },
});

exports.sendMail = function(to, subject, text, callback) {
    var transporter = nodemailer.createTransport(cgcTransport);
    var from_address = DEFAULT_FROM_ADDRESS;

    transporter.sendMail({
        from: from_address,
        to: to,
        subject: subject,
        text: text
    }, function(err, info) {
        if (err) {
            console.error(err);
        }
    });

    callback(null, true);
};

exports.sendMailFromTemplate = function(to, subject, templateFunction, locals, callback) {
    var transporter = nodemailer.createTransport(cgcTransport);
    var from_address = DEFAULT_FROM_ADDRESS;

    transporter.sendMail({
        from: from_address,
        to: to,
        subject: subject,
        html: templateFunction(locals)
    }, function(err, info) {
        if (err) {
            console.error(err);
        }
    });
    
    callback(null, true);
};

