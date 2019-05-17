/**
 * Module dependencies.
 */
import mongoose from 'mongoose';

const { Schema } = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
  name: String,
  username: {
    type: String,
    unique: true
  },
  location: String,
  level: String,
  access_token: String,
  token_type: String,
  refresh_token: String,
  expires_in: Date,
  user_id: {
    type: String,
    unique: true
  },
  activities: Array,
  picName: String,
  totalDistance: Number,
  totalCalories: Number,
  totalDuration: Number,
  totalSteps: Number,
}, {
  strict: false
});

UserSchema.statics = {
  load(id, cb) {
    this.findOne({ _id: id }).exec(cb);
  }
};

export const User = mongoose.model('User', UserSchema);
