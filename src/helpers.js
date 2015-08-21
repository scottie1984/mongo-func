import * as R from 'ramda';
import { connectToCollection } from './connection';

export let resultResolver = (resolve, reject) => {
    return (err, result) => {
       if (err) {
          reject(err);
       } else {
          resolve(result);
       }
    };
};

export let runner = R.curry((fn, connectionString, collectionName) => {
    return () => {
        return mongoFnRunner(fn, collectionName, connectionString);
    };
});

export let funcBuilder = R.curry((mongoFn, input, connectionString, collectionName) => {
    return R.curryN(input.length, (...args) => {
        let inputValue = input.apply(null,args);
        return mongoFnRunner(mongoFn(inputValue), collectionName, connectionString);
    });
});

export let funcBuilder2 = R.curry((mongoFn, query, update, connectionString, collectionName) => {
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

export function createInputFn(input){
    let inputFn = input;
    if (typeof input === 'object') {
       inputFn = function() { return input; };
    }
    return inputFn;
}

function mongoFnRunner(fn, collectionName, connectionString) {
    let connector = R.composeP(fn, connectToCollection(collectionName));
    return connector(connectionString);
}