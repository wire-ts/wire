import { Immutable, Store } from "./common";
import { enable as enableDevtools } from "./devtools";
import createHook from "./hook";
import makeClassConnector from "./class-connect";

const rootStore = <T extends Record<string, Store<any>>>(map: T) => ({
    enableDebugging: () => enableDevtools(map),
    getState: () => map as Immutable<T>,
    // connector for hooks
    useStore: createHook(map),
    // connector for class-based components
    connect:  makeClassConnector(map),
});

export default rootStore;
