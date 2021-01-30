import { SubscribeFn } from "./common";
export declare namespace Input {
    type Actions<S> = Record<string, (state: S, ...args: any[]) => S | Promise<S>>;
    type Thunks<S, A extends Actions<S>> = Record<string, (store: {
        state: S;
        actions: Output.Actions<S, A>;
    }, ...args: any[]) => void | Promise<void>>;
    type StoreWithState<S> = {
        actions: <A extends Actions<S>>(actions: A) => Output.BasicStore<S, A>;
    };
}
export declare namespace Output {
    type Actions<S, A extends Input.Actions<S>> = {
        [k in keyof A]: A[k] extends (s: S, ...args: infer Args) => Promise<S> ? (...args: Args) => Promise<void> : A[k] extends (s: S, ...args: infer Args) => any ? (...args: Args) => void : never;
    };
    type Thunks<S, A extends Input.Actions<S>, T extends Input.Thunks<S, A>> = {
        [k in keyof T]: T[k] extends (store: any, ...args: infer A) => infer O ? (...args: A) => O : never;
    };
    type BasicStore<S, A extends Input.Actions<S>> = {
        state: Readonly<S>;
        subscribe: (f: SubscribeFn) => () => void;
        actions: Actions<S, A>;
        thunks: <T extends Input.Thunks<S, A>>(thunks: T) => StoreWithThunks<S, A, T>;
    };
    type StoreWithThunks<S, A extends Input.Actions<S>, T extends Input.Thunks<S, A>> = Omit<BasicStore<S, A>, "thunks"> & {
        thunks: Thunks<S, A, T>;
    };
}
declare const store: <S>(initialState: S) => Input.StoreWithState<S>;
export default store;
