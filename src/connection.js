"use strict";

import { MongoClient } from 'mongodb';
import * as Q from 'q';

export function getConnection(connectionString) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(connectionString, (err, db) => {
            if(err) {
                reject(err);
            } else {
                resolve(db);
            }
        });
    });
}