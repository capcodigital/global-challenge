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
        CyclingConverted: Number,
        Rowing: Number,
        Yoga: Number
    },
    members: [],
    teamAvatar: String,
    totalDistance: Number,
    totalDistanceConverted: Number,
    totalDuration: Number,
    completionDate: Date,
    
}, {strict: false});

TeamSchema.statics = {
    load: function (id, cb) {
        this.findOne({ _id : id })
        .then(() => {
          cb();
        }).catch((err) => {
            
        });
      }
    };

var Team = mongoose.model('Team', TeamSchema);
