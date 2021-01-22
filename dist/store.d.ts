declare type InputStore<S extends object, I extends object> = {
    state: S;
} & {
    [k in keyof I]: k extends "state" ? S : I[k] extends (this: InputStore<S, I>, ...args: infer Args) => infer O ? (this: InputStore<S, I>, ...args: Args) => O : I[k];
};
export declare type Store<S, I extends object> = Readonly<{
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
} & Omit<I, "state">>;
export declare const keys: <T extends object>(o: T) => (keyof T)[];
export declare const createStore: <S extends object, I extends object>(input: InputStore<S, I>) => Readonly<{
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
} & Pick<I, Exclude<keyof I, "state">>>;
export {};
