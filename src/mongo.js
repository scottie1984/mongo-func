'use strict';

import * as helpers from './helpers';
import * as R from 'ramda';

let findOneDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.findOne(document, helpers.resultResolver(resolve, reject));
    });
});

let findDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.find(document).toArray(helpers.resultResolver(resolve, reject));
    });
});

let insertDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.insert(document, helpers.resultResolver(resolve, reject));
    });
});

let updateDoc = R.curry( (query, update, collection) => {
    return new Promise((resolve, reject) => {
        collection.update(query, update, helpers.resultResolver(resolve, reject));
    });
});

let removeDoc = R.curry( (document, collection) => {
    return new Promise((resolve, reject) => {
        collection.remove(document, helpers.resultResolver(resolve, reject));
    });
});

let drop = collection => {
    return new Promise((resolve, reject) => {
        collection.drop(helpers.resultResolver(resolve, reject));
    });
};

export var findOne = R.curry((connectionString, collectionName, input) => {
    return helpers.funcBuilder(findOneDoc, helpers.createInputFn(input), connectionString, collectionName);
});

export var find = R.curry((connectionString, collectionName, input) => {
    return helpers.funcBuilder(findDoc, helpers.createInputFn(input), connectionString, collectionName);
});

export var insert = R.curry((connectionString, collectionName, input) => {
    return helpers.funcBuilder(insertDoc, helpers.createInputFn(input), connectionString, collectionName);
});

export let update = R.curry((connectionString, collectionName, query, update) => {
    return helpers.funcBuilder2(updateDoc, helpers.createInputFn(query), update, connectionString, collectionName);
});

export let dropCollection = R.curry((connectionString, collectionName) => {
    return helpers.runner(drop, connectionString, collectionName);
});

export let remove = R.curry((connectionString, collectionName, input) => {
    return helpers.funcBuilder(removeDoc, helpers.createInputFn(input), connectionString, collectionName);
});