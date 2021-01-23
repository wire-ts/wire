"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const store = (input) => {
    const subscribers = new Map();
    const broadcast = () => {
        for (const callback of subscribers.values()) {
            callback();
        }
    };
    const newStore = Object.assign(Object.assign({}, input), { subscribe: (f) => {
            const index = subscribers.size;
            subscribers.set(index, f);
            return () => subscribers.delete(index);
        } });
    Object.keys(input).forEach((key) => {
        if (key !== "state" &&
            input[key].constructor.name ===
                "Function") {
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
exports.store = store;
