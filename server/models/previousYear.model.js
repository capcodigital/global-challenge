/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Previous Year Schema
 */
var PreviousYearSchema = new Schema({
    day: {
        type: Number,
        unique: true
    },
    date: Date,
    dayTotal: Number,
    cumulativeTotal: Number,
    perHour: Number
}, {strict: false});

PreviousYearSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id })
    .then(() => {
      cb();
    }).catch((err) => {
        
    });
  }
};

var PreviousYear = mongoose.model('PreviousYear', PreviousYearSchema);
