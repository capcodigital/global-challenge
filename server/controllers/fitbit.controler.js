/**
 * Module dependencies.
 */
import { model } from 'mongoose';
import { request } from 'https';
import { getUser } from '../services/cit';
import _ from 'lodash';

const User = model('User');

const secret = '1b057c2e46b0dd19ec40cba83f9d8da3';
const client_id = '228MZ3';

const code = `${client_id}:${secret}`;
const authorizationCode = `Basic  ${new Buffer(code).toString('base64')}`;
const headers = {
  'Authorization' : authorizationCode,
  'Content-Type': 'application/x-www-form-urlencoded'
};

const options = {
  hostname: 'api.fitbit.com',
  method: 'POST',
  port: 443,
  headers: headers,
  agent: false
};

let getOptions = {
  hostname: 'api.fitbit.com',
  method: 'GET',
  headers: {
    Authorization: 'Bearer ',
  },
  port : 443,
  agent: false,
};

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
updateEveryInterval(1);

/**
* List of Users
*/
export const authorize = (req, res) => {

  if (!req.query.code || req.query.error) {
    res.send(403)
      .send({ user: ' Could not authenticate with your Fitbit account'});
  } else {
    let username = req.query.state;
    
    if (process.env.NODE_ENV === 'production') {
      options.path = `/oauth2/token?code=${req.query.code}&grant_type=authorization_code&client_id=${client_id}&client_secret=${secret}&redirect_uri=https://capcoglobalchallenge.com/fitbit/auth`;
    } else {
      options.path = `/oauth2/token?code=${req.query.code}&grant_type=authorization_code&client_id=${client_id}&client_secret=${secret}&redirect_uri=https://localhost:3000/fitbit/auth`;
    }
        
    const  newReq = buildRequest(options, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        getUser(username.toLowerCase(), (err, profile) => {
        
          if (err) {
            res.status(403)
              .send({'errormsg': 'Could not find your Capco ID'});
          } else {
            let user = new User();
            
            const date = new Date();
            const datemillis = date.getTime();

            const expiresTime = new Date(result.expires_in*1000);
            const expiresTimeMillis = expiresTime.getTime();

            let expiration = new Date();
            expiration.setTime(datemillis + expiresTimeMillis);

            user.username = username;
            user.user_id = result.user_id;
            user.token_type = result.token_type;
            user.expires_in = expiration;
            user.access_token = result.access_token;
            user.refresh_token = result.refresh_token;

            user.level = profile.title;
            user.name = profile.displayName;
            user.location = profile.locationName;
            user.picName = profile.profilePictureName;

            user.totalSteps = 0;
            user.totalCalories = 0;
            user.totalDistance = 0;
            user.totalDuration = 0;

            save(user, res);
          }
        });
      }
    });

    newReq.end();
  }
}

/**
* Loop through all users and update their stats from fitbit
*/
export const update = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      res.status(403)
        .send({ errormsg: 'Server error please try again later'});
    } else {
      for (var i = 0; i < users.length; i++) {
        if (users[i].access_token) {
            updateUser(users[i]);
        }
      }
        
      res.end();
    }
  });
}

const buildRequest = (options, callback) => {
  const req = request(options, (res) => {
    res.setEncoding('utf8');
    res.body = '';

    res.on('data', (chunk) => {
      res.body += chunk;
    });

    res.on('end', () => {
      result = JSON.parse(res.body);
      if (result.code) {
        callback(result, null);
      } else {
        callback(null, result);
      }
    });

    res.on('error', (err) => {
      console.log(`Error sending request: ${err.message}`);
    });
  });

  return req;
}

const updateUser = (user) => {
  const today = new Date();
  if (user.expires_in < today) {
        
    // If token is expired refresh access token and get a new refresh token
    options.path = `/oauth2/token?grant_type=refresh_token&refresh_token=${user.refresh_token}`;

    const newReq2 = buildRequest(options, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const date = new Date();
        const datemillis = date.getTime();

        const expiresTime = new Date(result.expires_in*1000);
        const expiresTimeMillis = expiresTime.getTime();

        let expiration = new Date();
        expiration.setTime(datemillis + expiresTimeMillis);

        user.access_token = result.access_token;
        user.refresh_token = result.refresh_token;
        user.expires_in = expiration;
      }

      newReq2.end();
      getStats();
    });
  } else {
    getStats();
  }

  return user;

  function getStats() {
    const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
    
    getOptions.path = `/1/user/${user.user_id}/activities/date/${date}.json`;
    getOptions.headers.Authorization = `Bearer ${user.access_token}`;

    const newReq = buildRequest(getOptions, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        result.date = date;
    
        const dbDate = user.activities.map(a => a.date);
        const lastdate = dbDate[dbDate.length - 1];

        // Check if we are updating the current day or adding a new one
        if (date == lastdate) {
          user.activities[user.activities.length - 1] = result;
        } else {
          user.activities.push(result);
        }

        // Update Stats Totals
        user.totalSteps = 0;
        user.totalDistance = 0;
        user.totalDuration = 0;
        user.totalCalories = 0;

        const activityCount = user.activities.length;
        for (var i = 0; i < activityCount; i++) {
          user.totalSteps = user.totalSteps + user.activities[i].summary.steps;
          user.totalDistance = user.totalDistance + user.activities[i].summary.distances[0].distance;
          user.totalDuration = user.totalDuration + user.activities[i].summary.fairlyActiveMinutes + user.activities[i].summary.lightlyActiveMinutes + user.activities[i].summary.veryActiveMinutes;
          user.totalCalories = user.totalCalories + user.activities[i].summary.activityCalories;
        }

        user.save((err) => {
          if (err) {
            console.log(err);
          }
        });
      }  
    });

    newReq.end();
  }
}

const save = (user, res) => {
  user.save((err) => {
    if (err) {
      console.log(err.message);
      if (err.code == 11000) {
        if (err.message.indexOf('username_1') > 0) {
          res.status(403)
            .send({ errormsg: 'You are already logged in to Fitbit with a user that has previously registered for the Global Challenge. If you need to register someone else, please log out of Fitbit and try again.' });
      } else {
        res.status(403)
          .send({ errormsg: 'The Capco ID or Email you entered has already been registered' });
        }
      } else {
        res.status(403)
          .send({ errormsg: 'Server error please try again later' });
      }
    } else {
      res.render('success', {});
    }
  });
}

/**
 * Refresh user fitbit data every minutes
 */
const updateEveryInterval = (minutes) => {
  console.log(`Begin stats refresh every ${minutes} minutes`);
  var millis = minutes * 60 * 1000;

  setInterval(() => {
    User.find().exec((err, users) => {
      if (err) {
        console.log('Data update error please try again later');
      } else {
        for (var i = 0; i < users.length; i++) {
          if (users[i].access_token) {
            updateUser(users[i]);
          }
        }
        console.log('All User updates complete');
      }
    });
  }, millis);
}
