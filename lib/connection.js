"use strict";

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getConnection = getConnection;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _mongodb = require('mongodb');

var _q = require('q');

var Q = _interopRequireWildcard(_q);

var dbSingleton = null;

function getConnection(connectionString) {
    return new Promise(function (resolve, reject) {
        if (dbSingleton) {
            resolve(dbSingleton);
        } else {
            _mongodb.MongoClient.connect(connectionString, function (err, db) {
                if (err) {
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