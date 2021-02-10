import { SubscribeFn, Immutable } from "../common";

export namespace Input {
  export type Actions<S> = Record<
    string,
    (state: Immutable<S>, ...args: any[]) => S | Promise<S>
  >;

  export type Thunks<S, A extends Actions<S>> = Record<
    string,
    (
      store: { state: Immutable<S>; actions: Output.Actions<S, A> },
      ...args: any[]
    ) => void | Promise<void>
  >;

  export type StoreWithState<S> = {
    actions: <A extends Actions<S>>(actions: A) => Output.BasicStore<S, A>;
  };
}

export namespace Output {
  export type Actions<S, A extends Input.Actions<S>> = {
    [k in keyof A]: A[k] extends (s: Immutable<S>, ...args: infer Args) => Promise<S>
      ? (...args: Args) => Promise<void>
      : A[k] extends (s: Immutable<S>, ...args: infer Args) => any
      ? (...args: Args) => void
      : never;
  };

  export type Thunks<
    S,
    A extends Input.Actions<S>,
    T extends Input.Thunks<S, A>
  > = {
    [k in keyof T]: T[k] extends (store: any, ...args: infer A) => infer O
      ? (...args: A) => O
      : never;
  };

  export type BasicStore<S, A extends Input.Actions<S>> = {
    state: Immutable<S>;
    subscribe: (f: SubscribeFn) => () => void;
    actions: Actions<S, A>;
    thunks: <T extends Input.Thunks<S, A>>(
      thunks: T
    ) => StoreWithThunks<S, A, T>;
  };

  export type StoreWithThunks<
    S,
    A extends Input.Actions<S>,
    T extends Input.Thunks<S, A>
  > = Omit<BasicStore<S, A>, "thunks"> & {
    thunks: Thunks<S, A, T>;
  };
}
