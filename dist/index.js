"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootStore = exports.store = void 0;
const react_1 = __importDefault(require("react"));
var pure_1 = require("./pure");
Object.defineProperty(exports, "store", { enumerable: true, get: function () { return pure_1.store; } });
exports.rootStore = (map) => ({
    data: map,
    getState: () => map,
    useStore(f) {
        const [computed, setComputed] = react_1.default.useState(f(map));
        const updateProps = () => {
            setComputed(f(map));
        };
        react_1.default.useEffect(() => {
            const unsubs = Object.keys(map).map((k) => map[k].subscribe(updateProps));
            return () => {
                unsubs.forEach((unsub) => unsub());
            };
        }, []);
        return computed;
    },
});
