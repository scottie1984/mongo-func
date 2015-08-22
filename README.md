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
Providing a functional library to common MongoDB functions - findOne, find, insert, update and remove. All functions are curried by default therefore the functions aren't applied until the final parameter is provided. This allows you to create small, composable functions that are easy to test.

Each function also returns a promise with the result.
## Usage
```javascript
var mf = require('mongo-func');
```
#### findOne

#### find

#### insert

#### update

#### remove
