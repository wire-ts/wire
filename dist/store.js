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
const common_1 = require("./common");
const store = (initialState) => ({
    actions: (actions) => createStoreWithActions(initialState, actions),
});
class Subscribers {
    constructor() {
        this.i = 0;
        this.subscribers = new Map();
        this.add = (f) => {
            const index = this.i;
            this.subscribers.set(index, f);
            this.i++;
            return () => this.subscribers.delete(index);
        };
        this.broadcast = (method) => {
            for (const callback of this.subscribers.values()) {
                callback(method);
            }
        };
    }
}
const createStoreWithActions = (initialState, actions) => {
    const subscribers = new Subscribers();
    const newStore = {
        state: initialState,
        subscribe: subscribers.add,
        actions: {},
        thunks: (thunks) => {
            const storeWithThunks = newStore;
            storeWithThunks.thunks = common_1.keys(thunks).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: (...args) => {
                    thunks[key](storeWithThunks, ...args);
                    subscribers.broadcast(key);
                } })), {});
            return storeWithThunks;
        },
    };
    common_1.keys(actions).forEach((key) => {
        if (actions[key].constructor.name === "Function") {
            // @ts-ignore
            newStore.actions[key] = (...args) => {
                newStore.state = actions[key](newStore.state, ...args);
                subscribers.broadcast(key);
            };
        }
        else {
            // @ts-ignore
            newStore.actions[key] = (...args) => __awaiter(void 0, void 0, void 0, function* () {
                newStore.state = yield actions[key](newStore.state, ...args);
                subscribers.broadcast(key);
            });
        }
    });
    return newStore;
};
exports.default = store;
