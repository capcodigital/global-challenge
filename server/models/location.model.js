/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Location Schema
 */
var LocationSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    country: String,
    continent: String,
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
    avatar: String,
    totalDistance: Number,
    totalDistanceConverted: Number,
    averageDistance: Number,
    averageDistanceConverted: Number,
    totalDuration: Number,
    
}, {strict: false});

LocationSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id })
    .then(() => {
      cb();
    }).catch((err) => {
        
    });
  }
};

var Location = mongoose.model('Location', LocationSchema);
