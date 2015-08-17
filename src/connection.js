"use strict";

import { MongoClient } from 'mongodb';
import * as Q from 'q';

var dbSingleton = null;

export function getConnection(connectionString) {
    return new Promise((resolve, reject) => {
        if(dbSingleton) {
            resolve(dbSingleton);
        } else {
            MongoClient.connect(connectionString, (err, db) => {
                if(err) {
                    console.log("Error creating new connection: " + err);
                    reject(err);
                } else {
                    dbSingleton = db;
                    console.log("Created new connection for database: " + connectionString);
                    resolve(dbSingleton);
                }
            });
        }
    });
}