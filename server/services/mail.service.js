const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const DEFAULT_FROM_ADDRESS = "challenge@capco.com";

let tenantID = process.env.TENANT_ID;
let oAuthClientID = process.env.CLIENT_ID;
let clientSecret = process.env.CLIENT_SECRET;
let oAuthToken;

if (!tenantID || !oAuthClientID || !clientSecret) {
    tenantID = fs.readFileSync('./config/keys/tenantID.txt', 'utf8');
    oAuthClientID = fs.readFileSync('./config/keys/oAuthClientID.txt', 'utf8');
    clientSecret = fs.readFileSync('./config/keys/clientSecret.txt', 'utf8');
}

exports.sendMail = async function(to, subject, text, callback) {

    try {
        await axios({ // Get OAuth token to connect as OAuth client
            method: 'post',
            url: `https://login.microsoftonline.com/${tenantID}/oauth2/token`,
            data: new URLSearchParams({
                client_id: oAuthClientID,
                client_secret: clientSecret,
                resource: "https://graph.microsoft.com",
                grant_type: "client_credentials"
            }).toString()
        })
        .then(r => oAuthToken = r.data.access_token);

    } catch (err) {
        console.log("Email Token Failure");
        console.log(err);
    }

    let payload = { 
        message: {
          subject: subject,
          body: {
            contentType: 'TEXT',
            content: text
          },
          toRecipients: [{emailAddress: {address: to}}]
        }
      };

    try {

        await axios ({ // Send Email using Microsoft Graph
            method: 'post',
            url: `https://graph.microsoft.com/v1.0/users/${DEFAULT_FROM_ADDRESS}/sendMail`,
            headers: {
                'Authorization': "Bearer " + oAuthToken,
                'Content-Type': 'application/json'
            },
            data: payload
        })
    } catch (err) {
        console.log("Email Send Failure");
        console.log(err);
    }

    callback(null, true);
};
