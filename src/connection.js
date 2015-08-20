'use strict';

import { MongoClient } from 'mongodb';
import * as Q from 'q';
import * as R from 'ramda';

let connectionPool = {};

export function getConnection(connectionString) {
    return new Promise((resolve, reject) => {
        let hasConnection = R.pick([connectionString], connectionPool);
        if (R.keys(hasConnection).length !== 0) {
            resolve(connectionPool[connectionString]);
        } else {
            MongoClient.connect(connectionString, (err, db) => {
                if(err) {
                    reject(err);
                } else {
                    connectionPool[connectionString] = db;
                    resolve(db);
                }
            });
        }
    });
}