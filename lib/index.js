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
require("babel-polyfill");