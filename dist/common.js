"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keys = exports.deepCopy = void 0;
const deepCopy = (object) => {
    let outObject, value, key;
    if (typeof object !== "object" || object === null) {
        return object; // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(object) ? [] : {};
    for (key in object) {
        value = object[key];
        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = exports.deepCopy(value);
    }
    return outObject;
};
exports.deepCopy = deepCopy;
const keys = (object) => Object.keys(object);
exports.keys = keys;
