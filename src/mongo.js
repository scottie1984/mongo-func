"use strict";

// Retrieve
import * as mongo from 'mongodb';
import { getConnection } from './connection';
import * as Q from 'q';
import * as R from 'ramda';

var getCollection = R.curry( (collectionName, db) => {
    return db.collection(collectionName);
});

var connectToCollection = collectionName => {
    return R.composeP(getCollection(collectionName), getConnection);
};

var resultResolver = (resolve, reject) => {
    return (err, result) => {
       if (err) {
          reject(err);
       } else {
          resolve(result);
       }
    };
};

var findOneDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.findOne(document, resultResolver(resolve, reject));
    });
});

var findDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.find(document).toArray(resultResolver(resolve, reject));
    });
});

var insertDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.insert(document, resultResolver(resolve, reject));
    });
});

var updateDoc = R.curry( (query, update, collection) => {
    return new Promise((resolve, reject) => {
        collection.update(query, update, resultResolver(resolve, reject));
    });
});

var removeDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.remove(document, resultResolver(resolve, reject));
    });
});

var drop = collection => {
    return new Promise((resolve, reject) => {
        collection.drop(resultResolver(resolve, reject));
    });
};

var runner = R.curry((fn, connectionString, collectionName) => {
    var connector = R.composeP(fn, connectToCollection(collectionName));
    return () => {
        return connector(connectionString);
    };
});

var funcRunner = R.curry((mongoFn, input, connectionString, collectionName) => {
    var inputFn = input;
    if (typeof input === 'object') {
       inputFn = function() { return input; };
    }
    return R.curryN(inputFn.length, (...args) => {
        var queryValue = inputFn.apply(null,args);
        var connector = R.composeP(mongoFn(queryValue), connectToCollection(collectionName));
        return connector(connectionString);
    });
});

export var findOne = R.curry((connectionString, collectionName, input) => {
    return funcRunner(findOneDoc, input, connectionString, collectionName);
});

export var find = R.curry((connectionString, collectionName, input) => {
    return funcRunner(findDoc, input, connectionString, collectionName);
});

export var insert = R.curry((connectionString, collectionName, input) => {
    return funcRunner(insertDoc, input, connectionString, collectionName);
});

export var update = R.curry((connectionString, collectionName, query, update) => {
    return runner(updateDoc(query, update), connectionString, collectionName);
});

export var dropCollection = R.curry((connectionString, collectionName) => {
    return runner(drop, connectionString, collectionName);
});

export var remove = R.curry((connectionString, collectionName, input) => {
    return funcRunner(removeDoc, input, connectionString, collectionName);
});