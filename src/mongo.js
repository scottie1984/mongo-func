import * as helpers from "./helpers";
import * as R from "ramda";

let findOneDoc = R.curry((document, collection) => {
  return new Promise((resolve, reject) => {
    collection.findOne(document, helpers.resultResolver(resolve, reject));
  });
});

let findDoc = R.curry((document, collection) => {
  let operationDefinitions = ["limit", "sort", "skip"];
  let operations = R.pick(operationDefinitions, document);
  document = R.omit(operationDefinitions, document);

  return new Promise((resolve, reject) => {
    let find = collection.find(document);
    R.mapObjIndexed((val, key) => {
      find = find[key](val);
    }, operations);

    find.toArray(helpers.resultResolver(resolve, reject));
  });
});

let countDoc = R.curry((document, collection) => {
  return new Promise((resolve, reject) => {
    collection.count(document, helpers.resultResolver(resolve, reject));
  });
});

let insertDoc = R.curry((document, collection) => {
  return new Promise((resolve, reject) => {
    collection.insert(document, helpers.resultResolver(resolve, reject));
  });
});

let updateDoc = R.curry((query, update, collection) => {
  return new Promise((resolve, reject) => {
    collection.update(query, update, helpers.resultResolver(resolve, reject));
  });
});

let removeDoc = R.curry((document, collection) => {
  return new Promise((resolve, reject) => {
    collection.remove(document, helpers.resultResolver(resolve, reject));
  });
});

let drop = collection => {
  return new Promise((resolve, reject) => {
    collection.drop(helpers.resultResolver(resolve, reject));
  });
};

let distinctFields = R.curry((field, collection) => {
  return new Promise((resolve, reject) => {
    collection.distinct(field, helpers.resultResolver(resolve, reject));
  });
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
export var findOne = R.curry((connectionString, collectionName, query) => {
  return helpers.funcBuilder(
    findOneDoc,
    helpers.createInputFn(query),
    connectionString,
    collectionName
  );
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
export var find = R.curry((connectionString, collectionName, query) => {
  return helpers.funcBuilder(
    findDoc,
    helpers.createInputFn(query),
    connectionString,
    collectionName
  );
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
export var insert = R.curry((connectionString, collectionName, document) => {
  return helpers.funcBuilder(
    insertDoc,
    helpers.createInputFn(document),
    connectionString,
    collectionName
  );
});

//input: String, String, Object OR Function (returns Object), Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
//if update is a Function then another Function is returned ( accepts parameters of update function )
export let update = R.curry(
  (connectionString, collectionName, query, update) => {
    return helpers.funcBuilder2(
      updateDoc,
      helpers.createInputFn(query),
      update,
      connectionString,
      collectionName
    );
  }
);

//input: String, String
//output: Function
export let dropCollection = R.curry((connectionString, collectionName) => {
  return helpers.runner(drop, connectionString, collectionName);
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
export let remove = R.curry((connectionString, collectionName, query) => {
  return helpers.funcBuilder(
    removeDoc,
    helpers.createInputFn(query),
    connectionString,
    collectionName
  );
});

//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
export let count = R.curry((connectionString, collectionName, query) => {
  return helpers.funcBuilder(
    countDoc,
    helpers.createInputFn(query),
    connectionString,
    collectionName
  );
});

//input: String, String, String OR Function (returns String)
//output: Function ( accepts parameters of field function )
export let distinct = R.curry((connectionString, collectionName, field) => {
  return helpers.funcBuilder(
    distinctFields,
    helpers.createInputFn(field),
    connectionString,
    collectionName
  );
});

export let stats = helpers.stats;
