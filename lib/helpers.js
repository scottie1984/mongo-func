'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createInputFn = createInputFn;
exports.stats = stats;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _connection = require('./connection');

var resultResolver = function resultResolver(resolve, reject) {
    return function (err, result) {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
    };
};

exports.resultResolver = resultResolver;
var runner = R.curry(function (fn, connectionString, collectionName) {
    return function () {
        return mongoFnRunner(fn, collectionName, connectionString);
    };
});

exports.runner = runner;
var funcBuilder = R.curry(function (mongoFn, input, connectionString, collectionName) {
    return R.curryN(input.length, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        var inputValue = input.apply(null, args);
        return mongoFnRunner(mongoFn(inputValue), collectionName, connectionString);
    });
});

exports.funcBuilder = funcBuilder;
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

exports.funcBuilder2 = funcBuilder2;

function createInputFn(input) {
    var inputFn = input;
    if (typeof input === 'object' || typeof input === 'string') {
        inputFn = function () {
            return input;
        };
    }
    return inputFn;
}

function mongoFnRunner(fn, collectionName, connectionString) {
    var connector = R.composeP(fn, (0, _connection.connectToCollection)(collectionName));
    return connector(connectionString);
}

function stats(connectionString) {
    return (0, _connection.getConnection)(connectionString).then(function (db) {
        return new Promise(function (resolve, reject) {
            return db.stats(resultResolver(resolve, reject));
        });
    });
}