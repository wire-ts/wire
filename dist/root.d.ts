import { Immutable, Store } from "./common";
declare const rootStore: <T extends Record<string, Store<any>>>(map: T) => {
    enableDebugging: () => void;
    getState: () => Immutable<T>;
    useStore<MP>(f: (props: T) => MP): Immutable<MP>;
};
export default rootStore;