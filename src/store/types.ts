import { SubscribeFn, Immutable } from "../common";

export namespace Input {
  export type Actions<S> = Record<
    string,
    (state: Immutable<S>, ...args: never[]) => Immutable<S>
  >;

  export type Thunks = Record<
    string,
    (...args: never[]) => void | Promise<void>
  >;

  export type StoreWithState<S> = {
    actions: <A extends Actions<S>>(
      actions: A
    ) => Output.Store<S, A, null, null>;
  };

  export type Selectors<S> = Record<
    string,
    (state: Immutable<S>, ...args: never[]) => any
  >;
}

export namespace Output {
  export type Actions<S, A extends Input.Actions<S>> = {
    [k in keyof A]: A[k] extends (
      s: Immutable<S>,
      ...args: infer Args
    ) => Immutable<S>
      ? (...args: Args) => void
      : never;
  };

  export type Selectors<S, I extends Input.Selectors<S>> = {
    [k in keyof I]: I[k] extends (
      state: Immutable<S>,
      ...args: infer Args
    ) => infer O
      ? (...args: Args) => O
      : never;
  };

  export type Thunks<T extends Input.Thunks> = T;

  export type Store<S, A extends Input.Actions<S>, T, Sel> = {
    state: Immutable<S>;
    subscribe: (f: SubscribeFn) => () => void;
    actions: Actions<S, A>;
    thunks: T extends null
      ? <I extends Input.Thunks>(
          thunks: I
        ) => Store<S, A, Output.Thunks<I>, Sel>
      : T;
    selectors: Sel extends null
      ? <I extends Input.Selectors<S>>(
          selectors: I
        ) => Store<S, A, T, Output.Selectors<S, I>>
      : Sel;
  };
}
