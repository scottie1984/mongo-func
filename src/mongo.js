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
    return () => {
        return mongoFnRunner(fn, collectionName, connectionString);
    };
});

let funcBuilder = R.curry((mongoFn, input, connectionString, collectionName) => {
    return R.curryN(input.length, (...args) => {
        let inputValue = input.apply(null,args);
        return mongoFnRunner(mongoFn(inputValue), collectionName, connectionString);
    });
});

let funcBuilder2 = R.curry((mongoFn, query, update, connectionString, collectionName) => {
    return R.curryN(query.length, (...args) => {
        let queryValue = query.apply(null,args);
        if (typeof update === 'object') {
           return mongoFnRunner(mongoFn(queryValue, update), collectionName, connectionString);
        } else {
            return R.curryN(query.length, (...args) => {
               let updateValue = update.apply(null,args);
               return mongoFnRunner(mongoFn(queryValue, updateValue), collectionName, connectionString);
            });
        }
    });
});

function mongoFnRunner(fn, collectionName, connectionString) {
    let connector = R.composeP(fn, connectToCollection(collectionName));
    return connector(connectionString);
}

function createInputFn(input){
    let inputFn = input;
    if (typeof input === 'object') {
       inputFn = function() { return input; };
    }
    return inputFn;
}

export var findOne = R.curry((connectionString, collectionName, input) => {
    return funcBuilder(findOneDoc, createInputFn(input), connectionString, collectionName);
});

export var find = R.curry((connectionString, collectionName, input) => {
    return funcBuilder(findDoc, createInputFn(input), connectionString, collectionName);
});

export var insert = R.curry((connectionString, collectionName, input) => {
    return funcBuilder(insertDoc, createInputFn(input), connectionString, collectionName);
});

export let update = R.curry((connectionString, collectionName, query, update) => {
    return funcBuilder2(updateDoc, createInputFn(query), update, connectionString, collectionName);
});

export let dropCollection = R.curry((connectionString, collectionName) => {
    return runner(drop, connectionString, collectionName);
});

export let remove = R.curry((connectionString, collectionName, input) => {
    return funcBuilder(removeDoc, createInputFn(input), connectionString, collectionName);
});