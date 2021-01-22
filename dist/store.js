"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = exports.keys = void 0;
exports.keys = (o) => Object.keys(o);
exports.createStore = (input) => {
    let i = 0;
    const subscribers = new Map();
    const broadcast = () => {
        for (const callback of subscribers.values()) {
            callback();
        }
    };
    const newStore = Object.assign(Object.assign({}, input), { subscribe: (f) => {
            const index = i;
            subscribers.set(index, f);
            i++;
            return () => subscribers.delete(index);
        } });
    exports.keys(input).forEach((key) => {
        if (key !== "state" &&
            input[key].constructor.name === "Function") {
            // @ts-ignore
            newStore[key] = (...args) => {
                // @ts-ignore
                input[key](...args);
                broadcast();
            };
        }
    });
    return newStore;
};
