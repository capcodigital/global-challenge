/**
 * events for boot
 **/
var async = require("async");

var ready = false;
var readyState = new (require("events").EventEmitter);

var dependencies = async.queue(function(waiter, callback) {
  waiter(callback);
});

// when all deps are done
dependencies.drain = function() {
  ready = true;
  readyState.emit("ready");
}

exports.onReady = function(cb) {
  if(ready) {
    cb()
  } else {
    readyState.once("ready", cb);
  }
}

exports.dependency = function() {
  var queueCallback;
  var done = false;
  dependencies.push(function waiter(asyncQCallback) {
    if(done) {
      asyncQCallback();
    } else {
      queueCallback = asyncQCallback;
    }
  });

  return function(err) {
    if(queueCallback) {
      queueCallback(err)
    }
    done = true;
  }
}
