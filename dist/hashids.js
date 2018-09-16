"use strict";
// this file here is for backwards compatibility with an earlier CommonJS version
const Hashids = require("./index").default;
Object.defineProperty(Hashids, "__esModule", {value: true});
Hashids.default = module.exports;
module.exports = Hashids;
