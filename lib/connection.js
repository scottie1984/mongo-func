"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectToCollection = undefined;
exports.getConnection = getConnection;

var _mongodb = require("mongodb");

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var connectionPool = {};

function getConnection(connectionObject) {
  return new Promise(function (resolve, reject) {
    var connectionString = typeof connectionObject === "string" ? connectionObject : connectionObject.connectionString;
    var options = typeof connectionObject === "string" ? {} : R.omit(["connectionString"], connectionObject);
    var hasConnection = R.pick([connectionString], connectionPool);
    if (R.keys(hasConnection).length !== 0) {
      resolve(connectionPool[connectionString]);
    } else {
      _mongodb.MongoClient.connect(connectionString, options, function (err, db) {
        if (err) {
          reject(err);
        } else {
          connectionPool[connectionString] = db;
          resolve(db);
        }
      });
    }
  });
}

var getCollection = R.curry(function (collectionName, db) {
  return db.collection(collectionName);
});

var connectToCollection = exports.connectToCollection = function connectToCollection(collectionName) {
  return R.composeP(getCollection(collectionName), getConnection);
};