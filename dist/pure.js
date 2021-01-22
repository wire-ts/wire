"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
exports.store = (input) => {
    const subscribers = new Map();
    let i = 0;
    const broadcast = () => {
        for (const callback of subscribers.values()) {
            callback();
        }
    };
    const newStore = {
        state: input.state,
        subscribe: (f) => {
            const index = i;
            subscribers.set(index, f);
            i++;
            return () => subscribers.delete(index);
        },
    };
    Object.keys(input).forEach((key) => {
        if (key === "state") {
            return;
        }
        const constructor = input[key].constructor.name;
        switch (constructor) {
            case "Function":
                // @ts-ignore
                newStore[key] = (...args) => {
                    // @ts-ignore
                    newStore.state = input[key](newStore.state, ...args);
                    broadcast();
                };
                break;
            case "AsyncFunction":
                // @ts-ignore
                newStore[key] = (...args) => __awaiter(void 0, void 0, void 0, function* () {
                    // @ts-ignore
                    newStore.state = yield input[key](newStore.state, ...args);
                    broadcast();
                });
                break;
        }
    });
    return newStore;
};
