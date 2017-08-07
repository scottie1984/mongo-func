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
    var operationDefinitions = ['limit', 'sort', 'skip'];
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
var findOne = R.curry(function (connectionString, collectionName, query) {
    return helpers.funcBuilder(findOneDoc, helpers.createInputFn(query), connectionString, collectionName);
});

exports.findOne = findOne;
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var find = R.curry(function (connectionString, collectionName, query) {
    return helpers.funcBuilder(findDoc, helpers.createInputFn(query), connectionString, collectionName);
});

exports.find = find;
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var insert = R.curry(function (connectionString, collectionName, document) {
    return helpers.funcBuilder(insertDoc, helpers.createInputFn(document), connectionString, collectionName);
});

exports.insert = insert;
//input: String, String, Object OR Function (returns Object), Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
//if update is a Function then another Function is returned ( accepts parameters of update function )
var update = R.curry(function (connectionString, collectionName, query, update) {
    return helpers.funcBuilder2(updateDoc, helpers.createInputFn(query), update, connectionString, collectionName);
});

exports.update = update;
//input: String, String
//output: Function
var dropCollection = R.curry(function (connectionString, collectionName) {
    return helpers.runner(drop, connectionString, collectionName);
});

exports.dropCollection = dropCollection;
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var remove = R.curry(function (connectionString, collectionName, query) {
    return helpers.funcBuilder(removeDoc, helpers.createInputFn(query), connectionString, collectionName);
});

exports.remove = remove;
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
var count = R.curry(function (connectionString, collectionName, query) {
    return helpers.funcBuilder(countDoc, helpers.createInputFn(query), connectionString, collectionName);
});

exports.count = count;
//input: String, String, String OR Function (returns String)
//output: Function ( accepts parameters of field function )
var distinct = R.curry(function (connectionString, collectionName, field) {
    return helpers.funcBuilder(distinctFields, helpers.createInputFn(field), connectionString, collectionName);
});

exports.distinct = distinct;
var stats = helpers.stats;
exports.stats = stats;