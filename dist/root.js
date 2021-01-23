"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const rootStore = (map) => {
    // @ts-ignore
    if (window._WIRE_EXTENSION !== undefined) {
        // @ts-ignore
        const log = window._WIRE_EXTENSION;
        Object.keys(map).map((k) => map[k].subscribe((method) => log(`${k}.${method}`)));
    }
    return {
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
    };
};
exports.default = rootStore;
