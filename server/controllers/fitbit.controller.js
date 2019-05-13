/**
 * Module dependencies.
 */
import { model } from 'mongoose';
import { getUser } from '../services/cit.service';

const User = model('User');

const secret = '1b057c2e46b0dd19ec40cba83f9d8da3';
const clientId = '228MZ3';

const code = `${clientId}:${secret}`;
const authorizationCode = `Basic  ${new Buffer(code).toString('base64')}`;
const headers = {
  Authorization: authorizationCode,
  'Content-Type': 'application/x-www-form-urlencoded'
};

const options = {
  hostname: 'api.fitbit.com',
  method: 'POST',
  port: 443,
  headers,
  agent: false
};

const getOptions = {
  hostname: 'api.fitbit.com',
  method: 'GET',
  headers: {
    Authorization: 'Bearer ',
  },
  port: 443,
  agent: false,
};

const getStats = (user, today) => {
  const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;

  getOptions.path = `/1/user/${user.user_id}/activities/date/${date}.json`;
  getOptions.headers.Authorization = `Bearer ${user.access_token}`;

  const newReq = (getOptions, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      result.date = date;

      const dbDate = user.activities.map((a) => a.date);
      const lastdate = dbDate[dbDate.length - 1];

      // Check if we are updating the current day or adding a new one
      if (date === lastdate) {
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
      for (let i = 0; i < activityCount; i + 1) {
        user.totalSteps += user.activities[i].summary.steps;
        user.totalDistance += user.activities[i].summary.distances[0].distance;
        user.totalDuration = user.totalDuration + user.activities[i].summary.fairlyActiveMinutes + user.activities[i].summary.lightlyActiveMinutes + user.activities[i].summary.veryActiveMinutes;
        user.totalCalories += user.activities[i].summary.activityCalories;
      }

      user.save((error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });

  newReq.end();
};

/**
 * Calculate expiration date
 */
const getExpirationDate = (result) => {
  const date = new Date();
  const datemillis = date.getTime();

  const expiresTime = new Date(result.expires_in * 1000);
  const expiresTimeMillis = expiresTime.getTime();

  const expiration = new Date();
  expiration.setTime(datemillis + expiresTimeMillis);

  return expiration;
};

const save = (user, res) => {
  user.save((err) => {
    if (err) {
      console.log(err.message);
      if (err.code === 11000) {
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
};

const updateUser = (user) => {
  const today = new Date();
  if (user.expires_in < today) {
    // If token is expired refresh access token and get a new refresh token
    options.path = `/oauth2/token?grant_type=refresh_token&refresh_token=${user.refresh_token}`;

    const newReq2 = (options, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        user.access_token = result.access_token;
        user.refresh_token = result.refresh_token;
        user.expires_in = getExpirationDate(result);
      }

      newReq2.end();
      getStats(user, today);
    });
  } else {
    getStats(user, today);
  }

  return user;
};

/**
* List of Users
*/
export const authorize = (req, res) => {
  if (!req.query.code || req.query.error) {
    res.send(403)
      .send({ user: ' Could not authenticate with your Fitbit account' });
  } else {
    const username = req.query.state;

    if (process.env.NODE_ENV === 'production') {
      options.path = `/oauth2/token?code=${req.query.code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${secret}&redirect_uri=https://capcoglobalchallenge.com/fitbit/auth`;
    } else {
      options.path = `/oauth2/token?code=${req.query.code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${secret}&redirect_uri=https://localhost:3000/fitbit/auth`;
    }

    const newReq = (options, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        getUser(username.toLowerCase(), (error, profile) => {
          if (error) {
            res.status(403)
              .send({ errormsg: 'Could not find your Capco ID' });
          } else {
            const user = new User({
              username,
              user_id: result.user_id,
              token_type: result.token_type,
              access_token: result.access_token,
              refresh_token: result.refresh_token,
              level: profile.title,
              name: profile.displayName,
              location: profile.locationName,
              picName: profile.profilePictureName,
              expires_in: getExpirationDate(result),
              totalCalories: 0,
              totalDistance: 0,
              totalDuration: 0,
              totalSteps: 0
            });

            save(user, res);
          }
        });
      }
    });

    newReq.end();
  }
};

/**
* Loop through all users and update their stats from fitbit
*/
export const update = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      res.status(403)
        .send({ errormsg: 'Server error please try again later' });
    } else {
      for (let i = 0; i < users.length; i + 1) {
        if (users[i].access_token) {
          updateUser(users[i]);
        }
      }

      res.end();
    }
  });
};

/**
 * Refresh user fitbit data every minutes
 */
const updateEveryInterval = (minutes) => {
  console.log(`Begin stats refresh every ${minutes} minutes`);
  const millis = minutes * 60 * 1000;

  setInterval(() => {
    User.find().exec((err, users) => {
      if (err) {
        console.log('Data update error please try again later');
      } else {
        for (let i = 0; i < users.length; i + 1) {
          if (users[i].access_token) {
            updateUser(users[i]);
          }
        }
        console.log('All User updates complete');
      }
    });
  }, millis);
};

// The master node should update the stats in the database at set intervals and then
// the child nodes will automatically pick up the changes
updateEveryInterval(1);
