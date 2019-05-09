/* eslint-disable global-require */
/**
 * events for boot
 * */
import { queue } from 'async';

let ready = false;
const readyState = new (require('events').EventEmitter)();

const dependencies = queue((waiter, callback) => {
  waiter(callback);
});

// when all deps are done
dependencies.drain = () => {
  ready = true;
  readyState.emit('ready');
};

export const onReady = (cb) => {
  if (ready) {
    cb();
  } else {
    readyState.once('ready', cb);
  }
};

export const dependency = () => {
  let queueCallback;
  let done = false;
  dependencies.push((asyncQCallback) => {
    if (done) {
      asyncQCallback();
    } else {
      queueCallback = asyncQCallback;
    }
  });

  return (err) => {
    if (queueCallback) {
      queueCallback(err);
    }
    done = true;
  };
};
