/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Country Schema
 */
var CountrySchema = new Schema({
    name: {
        type: String,
        unique: true
    },
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

CountrySchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id })
    .then(() => {
      cb();
    }).catch((err) => {
        
    });
  }
};

var Country = mongoose.model('Country', CountrySchema);
