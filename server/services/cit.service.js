const https = require("https");
var fs = require('fs');

var headers = {
    'Authorization' : ''
};

const credentials = {
    client: {
        id: 'data-stories',
        secret: 'ladiescompanypresident'
    },
    auth: {
        tokenHost: 'https://capi.capco.com'
    }
};

var options = {
    hostname: 'capi.capco.com',
    method: 'GET',
    headers: headers,
    port: 443,
    agent: false
};

const oauth2 = require('simple-oauth2').create(credentials);
var token = '';

// Should only try to access CiT from a dev or demo environment
getAccessToken();

exports.getAllUsers = function(callback) {
    var getUserOptions = options;
    getUserOptions.path = "/api/users";

    if (token.expired()) {
        getAccessToken(getUserOptions, callback);
    } else {
        userRequest(getUserOptions, callback);
    }
};

exports.getUser = function(fourLetterId, callback) {
    var getUserOptions = options;
    getUserOptions.path = "/api/users/external/capco/" + fourLetterId;

    if (token.expired()) {
        getAccessToken(getUserOptions, callback);
    } else {
        userRequest(getUserOptions, callback);
    }
};

function getAccessToken(options, callback) {
    oauth2.clientCredentials.getToken({})
        .then(function(result) {
            token = oauth2.accessToken.create(result);
            headers['Authorization'] = "Bearer " + token.token.access_token;

            if (callback) {
                userRequest(options, callback);
            }
        })
        .catch(function(error) {
            console.log('CAPI Token Error', error);
        });
}

function userRequest(options, callback) {
    var req = buildRequest(options, callback);
    req.end();
}

function buildRequest(options, callback) {
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.body = '';

        res.on('data', function(chunk) {
            res.body += chunk;
        });

        res.on('end', function() {
            var result = null;
            try {
                result = JSON.parse(res.body);

                if (result.code) {
                    callback(result, null);
                } else {
                    callback(null, result);
                }
            } catch (err) {
                callback(err, null);
            }
        });

        res.on('error', function(err) {
            console.log('Error sending request: ' + err.message);
        });
    });
    return req;
}

exports.getUserPhoto = function(userId, callback) {
    var getUserPhotoOptions = options;
    getUserPhotoOptions.path = "/api/users/" + userId + "/images/profile";

    var req = buildPhotoRequest(getUserPhotoOptions, callback);
    req.end();
};

function buildPhotoRequest(options, callback) {
    var req = https.request(options, function (res) {
        var buffers = [];
        var length = 0;

        res.on('data', function (chunk) {
            length += chunk.length;
            buffers.push(chunk);
        });

        res.on('end', function () {
            var image = Buffer.concat(buffers);
            var result = {};
            result.photo = image;
            result.length = length;
            result.type = res.headers['content-type'];
            callback(null, result);
        });

        res.on('error', function (err) {
            logger.error('Error on response: ' + err.message);
        });
    });

    req.on('error', function (err) {
        logger.error('Error on request: ' + err.message);
        callback(err, null);
    });

    return req;
}

