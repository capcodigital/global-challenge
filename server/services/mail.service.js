/**
 * Module dependencies.
 */
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');

var DEFAULT_FROM_ADDRESS = "challenge@capco.com";

var emailUser = process.env.EMAIL_USER;
var emailPassword = process.env.EMAIL_PASSWORD;

if (!emailUser || !emailPassword) {
    emailUser = fs.readFileSync('./config/keys/emailUser.txt', 'utf8');
    emailPassword = fs.readFileSync('./config/keys/emailPassword.txt', 'utf8');
}

var emailConnectionDetails = {
    // host: "smtp.office365.com",
    port: 587,
    service: "Outlook365",
    // secure: false,
    auth: {
        user: emailUser,
        pass: emailPassword
    // },
    // tls: {
    //     ciphers: 'SSLv3'
    }
};

exports.sendMail = function(to, subject, text, callback) {
    var transporter = nodemailer.createTransport(emailConnectionDetails);
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
    var transporter = nodemailer.createTransport(emailConnectionDetails);
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

