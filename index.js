"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _verify = require("./src/verify.js");

var _verify2 = _interopRequireDefault(_verify);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(_verify2.default);
}

exports.default = _verify2.default;