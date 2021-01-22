"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootStore = exports.useStore = exports.store = void 0;
const react_1 = __importDefault(require("react"));
var pure_1 = require("./pure");
Object.defineProperty(exports, "store", { enumerable: true, get: function () { return pure_1.store; } });
function useStore(store, f) {
    const map = store.data;
    const [computed] = react_1.default.useState(f(map));
    //const updateProps = () => setComputed(f(map));
    return computed;
}
exports.useStore = useStore;
exports.rootStore = (map) => ({
    data: map,
    getState: () => map,
});
