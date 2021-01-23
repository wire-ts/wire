import { SubscribeFn } from "./common";
declare type Store<S, M extends Methods<S>> = Readonly<{
    state: Readonly<S>;
    subscribe: (f: SubscribeFn) => () => void;
}> & Omit<{
    [k in keyof M]: M[k] extends (s: any, ...args: infer A) => S ? (...args: A) => void : M[k] extends (s: any, ...args: infer A) => Promise<S> ? (...args: A) => Promise<void> : never;
}, "state">;
declare type Methods<S> = Readonly<Record<string, S | ((this: unknown, state: Readonly<S>, ...args: any[]) => S | Promise<S>)>>;
declare type Input<S, M> = Readonly<{
    state: S;
}> & M;
declare const store: <S, M extends Readonly<Record<string, S | ((this: unknown, state: Readonly<S>, ...args: any[]) => S | Promise<S>)>>>(input: Input<S, M>) => Store<S, M>;
export default store;
