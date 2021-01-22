declare type Store<S, I> = Readonly<{
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
} & I>;
declare type InputStore<S, I extends Record<string, any>> = Readonly<{
    [k in keyof I]: I[k];
} & {
    state: S;
}>;
export declare const store: <S, I extends object>(input: Readonly<{ [k in keyof I]: I[k]; } & {
    state: S;
}>) => Readonly<{
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
} & I>;
export {};
