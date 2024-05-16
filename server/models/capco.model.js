/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Capco Schema
 */
var CapcoSchema = new Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    email: String,
    location: String,
    country: String,
    level: String
}, {strict: false});

CapcoSchema.statics = {
  load: function (id, cb) {
    this.findOne({ _id : id })
    .then(() => {
      cb();
    }).catch((err) => {
        
    });
  }
};

var Capco = mongoose.model('Capco', CapcoSchema);
