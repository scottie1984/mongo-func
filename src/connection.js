'use strict';

import { MongoClient } from 'mongodb';
import * as R from 'ramda';

let connectionPool = {};

function getConnection(connectionString) {
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

let getCollection = R.curry( (collectionName, db) => {
    return db.collection(collectionName);
});

export let connectToCollection = collectionName => {
    return R.composeP(getCollection(collectionName), getConnection);
};