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
        type: String
    },
    activities: {
        Walk: Number,
        Run: Number,
        Swim: Number, 
        Cycling: Number,
        Rowing: Number
    },
    members: [],
    teamAvatar: String,
    totalDistance: Number,
    totalDuration: Number,
    completionDate: Date,
    
}, {strict: false});

TeamSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id }).exec(cb);
  }
};

var Team = mongoose.model('Team', TeamSchema);
