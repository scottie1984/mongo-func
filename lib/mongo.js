'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var findOneDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.findOne(document, helpers.resultResolver(resolve, reject));
    });
});

var findDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.find(document).toArray(helpers.resultResolver(resolve, reject));
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

var findOne = R.curry(function (connectionString, collectionName, input) {
    return helpers.funcBuilder(findOneDoc, helpers.createInputFn(input), connectionString, collectionName);
});

exports.findOne = findOne;
var find = R.curry(function (connectionString, collectionName, input) {
    return helpers.funcBuilder(findDoc, helpers.createInputFn(input), connectionString, collectionName);
});

exports.find = find;
var insert = R.curry(function (connectionString, collectionName, input) {
    return helpers.funcBuilder(insertDoc, helpers.createInputFn(input), connectionString, collectionName);
});

exports.insert = insert;
var update = R.curry(function (connectionString, collectionName, query, update) {
    return helpers.funcBuilder2(updateDoc, helpers.createInputFn(query), update, connectionString, collectionName);
});

exports.update = update;
var dropCollection = R.curry(function (connectionString, collectionName) {
    return helpers.runner(drop, connectionString, collectionName);
});

exports.dropCollection = dropCollection;
var remove = R.curry(function (connectionString, collectionName, input) {
    return helpers.funcBuilder(removeDoc, helpers.createInputFn(input), connectionString, collectionName);
});
exports.remove = remove;