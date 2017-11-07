"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stats = exports.distinct = exports.count = exports.remove = exports.dropCollection = exports.update = exports.insert = exports.find = exports.findOne = undefined;

var _helpers = require("./helpers");

var helpers = _interopRequireWildcard(_helpers);

var _ramda = require("ramda");

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var findOneDoc = R.curry(function (document, collection) {
  return new Promise(function (resolve, reject) {
    collection.findOne(document, helpers.resultResolver(resolve, reject));
  });
});

var findDoc = R.curry(function (document, collection) {
  var operationDefinitions = ["limit", "sort", "skip"];
  var operations = R.pick(operationDefinitions, document);
  document = R.omit(operationDefinitions, document);

  return new Promise(function (resolve, reject) {
    var find = collection.find(document);
    R.mapObjIndexed(function (val, key) {
      find = find[key](val);
    }, operations);

    find.toArray(helpers.resultResolver(resolve, reject));
  });
});

var countDoc = R.curry(function (document, collection) {
  return new Promise(function (resolve, reject) {
    collection.count(document, helpers.resultResolver(resolve, reject));
  });
});

var insertDoc = R.curry(function (document, collection) {
  return new Promise(function (resolve, reject) {
    collection.insert(document, helpers.resultResolver(resolve, reject));
  });
});

var updateDoc = R.curry(function (query, update, collection) {
  return new Promise(function (resolve, reject) {
    collection.update(query, update, helpers.resultResolver(resolve, reject));
  });
});

var removeDoc = R.curry(function (document, collection) {
  return new Promise(function (resolve, reject) {
    collection.remove(document, helpers.resultResolver(resolve, reject));
  });
});

var drop = function drop(collection) {
  return new Promise(function (resolve, reject) {
    collection.drop(helpers.resultResolver(resolve, reject));
  });
};

var distinctFields = R.curry(function (field, collection) {
  return new Promise(function (resolve, reject) {
    collection.distinct(field, helpers.resultResolver(resolve, reject));
  });
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var findOne = exports.findOne = R.curry(function (connectionString, collectionName, query) {
  return helpers.funcBuilder(findOneDoc, helpers.createInputFn(query), connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var find = exports.find = R.curry(function (connectionString, collectionName, query) {
  return helpers.funcBuilder(findDoc, helpers.createInputFn(query), connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var insert = exports.insert = R.curry(function (connectionString, collectionName, document) {
  return helpers.funcBuilder(insertDoc, helpers.createInputFn(document), connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object), Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
//if update is a Function then another Function is returned ( accepts parameters of update function )
var update = exports.update = R.curry(function (connectionString, collectionName, query, update) {
  return helpers.funcBuilder2(updateDoc, helpers.createInputFn(query), update, connectionString, collectionName);
});

//input: String, String
//output: Function
var dropCollection = exports.dropCollection = R.curry(function (connectionString, collectionName) {
  return helpers.runner(drop, connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var remove = exports.remove = R.curry(function (connectionString, collectionName, query) {
  return helpers.funcBuilder(removeDoc, helpers.createInputFn(query), connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var count = exports.count = R.curry(function (connectionString, collectionName, query) {
  return helpers.funcBuilder(countDoc, helpers.createInputFn(query), connectionString, collectionName);
});

//input: String, String, String OR Function (returns String)
//output: Function ( accepts parameters of field function )
var distinct = exports.distinct = R.curry(function (connectionString, collectionName, field) {
  return helpers.funcBuilder(distinctFields, helpers.createInputFn(field), connectionString, collectionName);
});

var stats = exports.stats = helpers.stats;