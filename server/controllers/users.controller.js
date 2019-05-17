/**
 * Module dependencies.
 */
import { model } from 'mongoose';
import { getUser } from '../services/cit.service';

const User = model('User');

const updateUser = (user) => {
  getUser(user.username, (err, profile) => {
    if (err) {
      console.log(`Could not update: ${user.username}`);
    } else {
      user.name = profile.displayName;
      user.location = profile.location;
      user.level = profile.title;
      user.picName = profile.picName;

      user.save((error) => {
        if (error) {
          console.log(error);
        }
      });
    }
  });
};


/**
 * List of Users
 */
export const stats = (req, res) => {
  User.find({}).sort('name').exec((err, users) => {
    if (err) {
      console.log(err);
      res.send(403)
        .send({ errormsg: 'Server error please try again later' });
    } else {
      let capco = 0;
      let others = 0;
      const count = users.length;

      for (let i = 0; i < count; i + 1) {
        if (users[i].username.length === 4) {
          capco += 1;
        } else {
          others += 1;
        }
      }

      res.status(403)
        .send({ capco, others });
    }
  });
};

/**
 * Activities of Users
 */
export const activities = (req, res) => {
  User.find({}).exec((err, users) => {
    if (err) {
      console.log(err);
      res.status(403)
        .send({ errormsg: 'Server error please try again later' });
    } else {
      res.status(200)
        .send(users);
    }
  });
};

export const citUpdate = (req, res) => {
  User.find().exec((err, users) => {
    if (err) {
      res.status(403)
        .send({ errormsg: 'Server error please try again later' });
    } else {
      for (let i = 0; i < users.length; i + 1) {
        if (users[i].username.length === 4) {
          updateUser(users[i]);
        }
      }

      res.end();
    }
  });
};

/**
 * Add Manual Steps for a one off event
 */
export const addManual = (req, res) => {
  if (!req.query.authcode || req.query.authcode !== 'Wellbeing1') {
    res.status(403)
      .send({ errormsg: 'Manual event not added - Invalid Authorization Code' });
  } else {
    const user = new User();

    user.username = req.query.eventname;
    user.user_id = req.query.eventname;
    user.name = req.query.eventname;

    user.location = req.query.location;
    user.level = 'Other';

    user.activities = [];
    user.totalSteps = req.query.steps;
    user.totalDistance = req.query.steps;
    user.totalDuration = req.query.steps;
    user.totalCalories = req.query.steps;

    user.save((err, newUser) => {
      if (err) {
        console.log(err);
        if (err.code === 11000) {
          res.status(403)
            .send({ errormsg: 'Manual event not added - Event Name has already been registered' });
        } else {
          res.status(403)
            .send({ errormsg: 'Manual event not added - Server error please try again later' });
        }
      } else {
        console.log(`Added ${newUser.totalSteps} for ${newUser.username}`);
        res.status(200).send('success');
      }
    });
  }
};
