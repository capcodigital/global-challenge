/* eslint-disable global-require */
import { connect, connection } from 'mongoose';
import { readdirSync, statSync } from 'fs';
import { db as __db } from './config';

import { dependency } from './status';

// Bootstrap db connection
export const db = connect(__db.toString(), { useMongoClient: true }, dependency());


connection.on('connected', () => {
  console.log('Database Connection Connected');
});

connection.on('open', () => {
  console.log('Database Connection Open');
});

connection.on('disconnected', () => {
  console.log('Database Connection Disconnected');
  console.log('End Process');
  process.exit();
});

connection.on('error', (err) => {
  console.log('Database Connection Failure');
  console.log(err);
  console.log('End Process');
  process.exit();
});

connection.on('close', () => {
  console.log('Database Connection Closed');
  console.log('End Process');
  process.exit();
});

// Bootstrap models
const modelsPath = `${__dirname}/../app/models`;
const walk = (path) => {
  readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$|coffee$)/.test(file)) {
        // eslint-disable-next-line import/no-dynamic-require
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

walk(modelsPath);
