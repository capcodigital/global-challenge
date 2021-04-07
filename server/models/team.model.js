/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Team Schema
 */
var TeamSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    captain: {
        type: String,
        unique: true
    },
    activities: {
    },
    members: [],
    picName: String,
    totalDistance: Number,
    totalCalories: Number,
    totalDuration: Number,
    totalSteps: Number,
}, {strict: false});

TeamSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  }
};

var Team = mongoose.model('Team', TeamSchema);
