'use strict';

// Retrieve
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _mongodb = require('mongodb');

var mongo = _interopRequireWildcard(_mongodb);

var _connection = require('./connection');

var _q = require('q');

var Q = _interopRequireWildcard(_q);

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var getCollection = R.curry(function (collectionName, db) {
    return db.collection(collectionName);
});

var connectToCollection = function connectToCollection(collectionName) {
    return R.composeP(getCollection(collectionName), _connection.getConnection);
};

var resultResolver = function resultResolver(resolve, reject) {
    return function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    };
};

var findOneDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.findOne(document, resultResolver(resolve, reject));
    });
});

var findDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.find(document).toArray(resultResolver(resolve, reject));
    });
});

var insertDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.insert(document, resultResolver(resolve, reject));
    });
});

var updateDoc = R.curry(function (query, update, collection) {
    return new Promise(function (resolve, reject) {
        collection.update(query, update, resultResolver(resolve, reject));
    });
});

var removeDoc = R.curry(function (document, collection) {
    return new Promise(function (resolve, reject) {
        collection.remove(document, resultResolver(resolve, reject));
    });
});

var drop = function drop(collection) {
    return new Promise(function (resolve, reject) {
        collection.drop(resultResolver(resolve, reject));
    });
};

var runner = R.curry(function (fn, connectionString, collectionName) {
    return function () {
        return mongoFnRunner(fn, collectionName, connectionString);
    };
});

var funcBuilder = R.curry(function (mongoFn, input, connectionString, collectionName) {
    return R.curryN(input.length, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var inputValue = input.apply(null, args);
        return mongoFnRunner(mongoFn(inputValue), collectionName, connectionString);
    });
});

var funcBuilder2 = R.curry(function (mongoFn, query, update, connectionString, collectionName) {
    return R.curryN(query.length, function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var queryValue = query.apply(null, args);
        if (typeof update === 'object') {
            return mongoFnRunner(mongoFn(queryValue, update), collectionName, connectionString);
        } else {
            return R.curryN(query.length, function () {
                for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                    args[_key3] = arguments[_key3];
                }

                var updateValue = update.apply(null, args);
                return mongoFnRunner(mongoFn(queryValue, updateValue), collectionName, connectionString);
            });
        }
    });
});

function mongoFnRunner(fn, collectionName, connectionString) {
    var connector = R.composeP(fn, connectToCollection(collectionName));
    return connector(connectionString);
}

function createInputFn(input) {
    var inputFn = input;
    if (typeof input === 'object') {
        inputFn = function () {
            return input;
        };
    }
    return inputFn;
}

var findOne = R.curry(function (connectionString, collectionName, input) {
    return funcBuilder(findOneDoc, createInputFn(input), connectionString, collectionName);
});

exports.findOne = findOne;
var find = R.curry(function (connectionString, collectionName, input) {
    return funcBuilder(findDoc, createInputFn(input), connectionString, collectionName);
});

exports.find = find;
var insert = R.curry(function (connectionString, collectionName, input) {
    return funcBuilder(insertDoc, createInputFn(input), connectionString, collectionName);
});

exports.insert = insert;
var update = R.curry(function (connectionString, collectionName, query, update) {
    return funcBuilder2(updateDoc, createInputFn(query), update, connectionString, collectionName);
});

exports.update = update;
var dropCollection = R.curry(function (connectionString, collectionName) {
    return runner(drop, connectionString, collectionName);
});

exports.dropCollection = dropCollection;
var remove = R.curry(function (connectionString, collectionName, input) {
    return funcBuilder(removeDoc, createInputFn(input), connectionString, collectionName);
});
exports.remove = remove;