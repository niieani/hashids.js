"use strict";
// this file here is for backwards compatibility with an earlier CommonJS version
const Hashids = require("./index").default;
Object.defineProperty(Hashids, "__esModule", {value: true});
module.exports = Hashids;
Hashids.default = module.exports;
