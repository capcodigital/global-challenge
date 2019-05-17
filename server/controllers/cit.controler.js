/**
 * Module dependencies.
 */
import { getAllUsers, getUser, getUserPhoto } from '../services/cit.service';

/**
 * List of Users
 */
export const all = (req, res) => {
  getAllUsers((err, result) => {
    if (err) {
      console.log(err);
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(result.content);
    }
  });
};

/**
 * Get one user
 */
export const me = (req, res) => {
  const { capcoId } = req.params.capcoId;

  getUser(capcoId, (err, result) => {
    if (err) {
      console.log(err);

      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(result);
    }
  });
};

export const getPhoto = (req, res) => {
  // This needs to be numeric user id not Capco 4 letter id
  const { capcoId } = req.params.capcoId;

  getUserPhoto(capcoId, (err, result) => {
    if (err) {
      console.log(err);

      res.render('error', {
        status: 500
      });
    } else {
      res.setHeader('Content-Type', result.type);
      res.setHeader('Content-Length', result.length);
      res.end(result.photo);
    }
  });
};
