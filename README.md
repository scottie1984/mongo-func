# mongo-func
A functional approach to MongoDB

[![Build Status](https://travis-ci.org/scottie1984/mongo-func.svg?branch=master)](https://travis-ci.org/scottie1984/mongo-func)
[![Coverage Status](https://coveralls.io/repos/scottie1984/mongo-func/badge.svg?branch=master&service=github)](https://coveralls.io/github/scottie1984/mongo-func?branch=master)
[![bitHound Score](https://www.bithound.io/github/scottie1984/mongo-func/badges/score.svg)](https://www.bithound.io/github/scottie1984/mongo-func)
![Dependencies](https://david-dm.org/scottie1984/mongo-func.svg)


## Install

```sh
$ npm install mongo-func --save
```
## What
Providing a functional library to common MongoDB functions:
* [findOne]()
* [find]()
* [insert]()
* [update]() 
* [remove]() 
* [dropCollection]() 

All functions are curried by default therefore the functions aren't applied until the final parameter is provided. This allows you to create small, composable functions that are easy to test. 

Each function also returns a promise with the result.
## Usage
```javascript
var mf = require('mongo-func');
```
#### findOne
Find one document from mongo based on the document query.
##### Parameters:
```javascript
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
mf.findOne(connectionString, collectionName, query)
```
##### Example:
```javascript
var findOner = mf.findOne('mongodb://localhost:27017/mongo-func');
var findOneFromTest = findOner('test');

findOneFromTest({scooby: 'doo'})().then(function(doc) {
    console.log(doc);
});
```
#### find
Find all documents from mongo based on the document query
##### Parameters:
```javascript
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
mf.find(connectionString, collectionName, query)
```
##### Example:
```javascript
var finder = mf.find('mongodb://localhost:27017/mongo-func');
var finderFromTest = finder('test');

finderFromTest({scooby: 'doo'})().then(function(docs) {
    console.log(docs);
});
```
#### insert
Insert document into mongo
##### Parameters:
```javascript
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
mf.insert(connectionString, collectionName, document)
```
##### Example:
```javascript
var inserter = mf.insert('mongodb://localhost:27017/mongo-func');
var insertToTest = inserter('test');

insertToTest({scooby: 'doo', scrappy: 'woo'})().then(function() {
    console.log('inserted');
});
```
#### update
Update document in mongo based on query object with the update object
##### Parameters:
```javascript
//input: String, String, Object OR Function (returns Object), Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
//if update is a Function then another Function is returned ( accepts parameters of update function )
mf.update(connectionString, collectionName, query, update)
```
##### Example:
```javascript
var updater = mf.update('mongodb://localhost:27017/mongo-func');
var updateToTest = updater('test');

updateToTest({scooby: 'doo'}, {$set: {scooby: 'too'}})().then(function() {
    console.log('Updated');
});
```
#### remove
Removes documents from mongo based on the query object
##### Parameters:
```javascript
//input: String, String, Object OR Function (returns Object)
//output: Function ( accepts parameters of query function )
mf.remove(connectionString, collectionName, query)
```
##### Example:
```javascript
var remover = mf.remove('mongodb://localhost:27017/mongo-func');
var removeFromTest = remover('test');

removeFromTest({scrappy: 'foo'})().then(function() {
    console.log('removed');
});
```
#### dropCollection
Drop collection from mongo
##### Parameters:
```javascript
//input: String, String
//output: Function
mf.dropCollection(connectionString, collectionName)
```
##### Example:
```javascript
mf.dropCollection('mongodb://localhost:27017/mongo-func', 'test')()
    .then(function() { console.log('dropped'); } );
```