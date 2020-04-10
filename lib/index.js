"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongo = require("./mongo");

Object.keys(_mongo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mongo[key];
    }
  });
});

var _connection = require("./connection");

Object.keys(_connection).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _connection[key];
    }
  });
});
require("babel-polyfill");