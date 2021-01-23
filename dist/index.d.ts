export { store } from "./pure";
import { Immutable } from "./helper-types";
interface Store<S> {
    state: S;
    subscribe: (f: () => void) => () => void;
}
export declare const rootStore: <S extends Store<any>, T extends Record<string, S>>(map: T) => {
    data: T;
    getState: () => T;
    useStore<MP>(f: (props: T) => MP): Immutable<MP>;
};
