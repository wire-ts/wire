export { store } from "./pure";
interface Store<S> {
    state: S;
    subscribe: (f: () => void) => () => void;
}
export interface RootStore<T extends Record<string, Store<any>>> {
    data: T;
    getState: () => T;
}
export declare function useStore<R extends RootStore<any>, MP>(store: R, f: (props: R["data"]) => MP): MP;
export declare const rootStore: <S extends Store<any>, T extends Record<string, S>>(map: T) => RootStore<T>;
