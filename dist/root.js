"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const common_1 = require("./common");
const getStateTree = (root) => common_1.keys(root).reduce((acc, key) => (Object.assign(Object.assign({}, acc), { [key]: common_1.deepCopy(root[key].state) })), {});
const rootStore = (map) => {
    return {
        enableDebugging: () => {
            const stateMap = getStateTree(map);
            let extensionReady = false;
            let outstandingMsgs = [];
            const postMessage = (msg) => {
                if (extensionReady) {
                    window.postMessage(msg, "*");
                }
                else {
                    outstandingMsgs.push(msg);
                }
            };
            postMessage({
                type: "WIRE_INIT",
                stateMap,
            });
            common_1.keys(map).map((k) => map[k].subscribe((method) => {
                postMessage({
                    type: "WIRE_CHANGE",
                    store: k,
                    method,
                    oldState: common_1.deepCopy(stateMap[k]),
                    newState: common_1.deepCopy(map[k].state),
                });
                stateMap[k] = common_1.deepCopy(map[k].state);
            }));
            window.addEventListener("message", (e) => {
                if (typeof e.data === "object" && e.data.type === "WIRE_EXT_READY") {
                    console.log("READY", outstandingMsgs);
                    extensionReady = true;
                    outstandingMsgs.forEach((m) => postMessage(m));
                    outstandingMsgs = [];
                }
            });
        },
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
