'use strict';

// Retrieve
import * as mongo from 'mongodb';
import { getConnection } from './connection';
import * as Q from 'q';
import * as R from 'ramda';

let getCollection = R.curry( (collectionName, db) => {
    return db.collection(collectionName);
});

let connectToCollection = collectionName => {
    return R.composeP(getCollection(collectionName), getConnection);
};

let resultResolver = (resolve, reject) => {
    return (err, result) => {
       if (err) {
          reject(err);
       } else {
          resolve(result);
       }
    };
};

let findOneDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.findOne(document, resultResolver(resolve, reject));
    });
});

let findDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.find(document).toArray(resultResolver(resolve, reject));
    });
});

let insertDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.insert(document, resultResolver(resolve, reject));
    });
});

let updateDoc = R.curry( (query, update, collection) => {
    return new Promise((resolve, reject) => {
        collection.update(query, update, resultResolver(resolve, reject));
    });
});

let removeDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.remove(document, resultResolver(resolve, reject));
    });
});

let drop = collection => {
    return new Promise((resolve, reject) => {
        collection.drop(resultResolver(resolve, reject));
    });
};

let runner = R.curry((fn, connectionString, collectionName) => {
    let connector = R.composeP(fn, connectToCollection(collectionName));
    return () => {
        return connector(connectionString);
    };
});

let funcRunner = R.curry((mongoFn, input, connectionString, collectionName) => {
    let inputFn = input;
    if (typeof input === 'object') {
       inputFn = function() { return input; };
    }
    return R.curryN(inputFn.length, (...args) => {
        let queryValue = inputFn.apply(null,args);
        let connector = R.composeP(mongoFn(queryValue), connectToCollection(collectionName));
        return connector(connectionString);
    });
});

export let findOne = R.curry((connectionString, collectionName, input) => {
    return funcRunner(findOneDoc, input, connectionString, collectionName);
});

export let find = R.curry((connectionString, collectionName, input) => {
    return funcRunner(findDoc, input, connectionString, collectionName);
});

export let insert = R.curry((connectionString, collectionName, input) => {
    return funcRunner(insertDoc, input, connectionString, collectionName);
});

export let update = R.curry((connectionString, collectionName, query, update) => {
    return runner(updateDoc(query, update), connectionString, collectionName);
});

export let dropCollection = R.curry((connectionString, collectionName) => {
    return runner(drop, connectionString, collectionName);
});

export let remove = R.curry((connectionString, collectionName, input) => {
    return funcRunner(removeDoc, input, connectionString, collectionName);
});