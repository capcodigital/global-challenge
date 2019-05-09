const https = require("https");

const headers = {
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

const options = {
  hostname: 'capi.capco.com',
  method: 'GET',
  headers: headers,
  port: 443,
  agent: false
};

const oauth2 = require('simple-oauth2').create(credentials);

let token = '';

// Should only try to access CiT from a dev or demo environment
getAccessToken();

export const getAllUsers = (callback) => {
  let getUserOptions = options;
  getUserOptions.path = "/api/users";

  if (token.expired()) {
    getAccessToken(getUserOptions, callback);
  } else {
    userRequest(getUserOptions, callback);
  }
};

export const getUser = (fourLetterId, callback) => {
  let getUserOptions = options;
  getUserOptions.path =`/api/users/external/capco/${fourLetterId}`;

  if (token.expired()) {
    getAccessToken(getUserOptions, callback);
  } else {
    userRequest(getUserOptions, callback);
  }
};

const getAccessToken = (options, callback) => {
  oauth2.clientCredentials.getToken({})
    .then((result) => {
      token = oauth2.accessToken.create(result);
      headers['Authorization'] = `Bearer ${token.token.access_token}`;

      if (callback) {
        userRequest(options, callback);
      }
    })
    .catch((error) => {
      console.log('CAPI Token Error', error);
    });
}

const userRequest = (options, callback) => {
  let req = buildRequest(options, callback);
  req.end();
}

const buildRequest = (options, callback) => {
  const req = https.request(options, (res) => {
    res.setEncoding('utf8');
    res.body = '';

    res.on('data', (chunk) => {
      res.body = `${res.body}${chunk}`;
    });

    res.on('end', () => {
      let result = null;
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

    res.on('error', (err) => {
      console.log(`Error sending request: ${err.message}`);
    });
  });

  return req;
}

export const getUserPhoto = (userId, callback) => {
  let getUserPhotoOptions = options;
  getUserPhotoOptions.path = `/api/users/${userId}/images/profile`;

  const req = buildPhotoRequest(getUserPhotoOptions, callback);
  req.end();
};

const buildPhotoRequest = (options, callback) => {
  const req = https.request(options, (res) => {
    let buffers = [];
    let length = 0;

    res.on('data', (chunk) => {
      length += chunk.length;
      buffers.push(chunk);
    });

    res.on('end', () => {
      const image = Buffer.concat(buffers);
      let result = {};
      result.photo = image;
      result.length = length;
      result.type = res.headers['content-type'];
      callback(null, result);
    });

    res.on('error', (err) => {
      logger.error(`Error on response: ${err.message}`);
    });
  });

  req.on('error', (err) => {
    logger.error(`Error on request: ${err.message}`);
    callback(err, null);
  });

  return req;
}
