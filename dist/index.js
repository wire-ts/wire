"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.rootStore = void 0;
var root_1 = require("./root");
Object.defineProperty(exports, "rootStore", { enumerable: true, get: function () { return __importDefault(root_1).default; } });
var store_1 = require("./store");
Object.defineProperty(exports, "store", { enumerable: true, get: function () { return __importDefault(store_1).default; } });
