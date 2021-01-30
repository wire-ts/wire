import { keys, SubscribeFn } from "./common";

export namespace Input {
  export type Actions<S> = Record<
    string,
    (state: S, ...args: any[]) => S | Promise<S>
  >;

  export type Thunks<S, A extends Actions<S>> = Record<
    string,
    (
      store: { state: S; actions: Output.Actions<S, A> },
      ...args: any[]
    ) => void | Promise<void>
  >;

  export type StoreWithState<S> = {
    actions: <A extends Actions<S>>(actions: A) => Output.BasicStore<S, A>;
  };
}

export namespace Output {
  export type Actions<S, A extends Input.Actions<S>> = {
    [k in keyof A]: A[k] extends (s: S, ...args: infer Args) => Promise<S>
      ? (...args: Args) => Promise<void>
      :

     A[k] extends (s: S, ...args: infer Args) => any
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
    state: Readonly<S>;
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

const store = <S>(initialState: S): Input.StoreWithState<S> => ({
  actions: <A extends Input.Actions<S>>(actions: A) =>
    createStoreWithActions(initialState, actions),
});

class Subscribers {
  private i = 0;
  private subscribers = new Map<number, SubscribeFn>();

  add = (f: SubscribeFn) => {
    const index = this.i;
    this.subscribers.set(index, f);
    this.i++;

    return () => this.subscribers.delete(index);
  };

  broadcast = (method: string) => {
    for (const callback of this.subscribers.values()) {
      callback(method);
    }
  };
}

const createStoreWithActions = <S, A extends Input.Actions<S>>(
  initialState: S,
  actions: A
): Output.BasicStore<S, A> => {
  const subscribers = new Subscribers();

  const newStore: Output.BasicStore<S, A> = {
    state: initialState,
    subscribe: subscribers.add,
    actions: {} as Output.Actions<S, A>,
    thunks: <T extends Input.Thunks<S, A>>(thunks: T) => {
      const storeWithThunks = (newStore as any) as Output.StoreWithThunks<
        S,
        A,
        T
      >;

      storeWithThunks.thunks = keys(thunks).reduce(
        (acc, key) => ({
          ...acc,
          [key]: (...args: any[]) => {
            thunks[key](storeWithThunks as any, ...args);
            subscribers.broadcast(key);
          },
        }),
        {} as Output.Thunks<S, A, T>
      );

      return storeWithThunks;
    },
  };

  keys(actions).forEach((key) => {
    if (actions[key].constructor.name === "Function") {
      // @ts-ignore
      newStore.actions[key] = (...args: any[]) => {
        newStore.state = actions[key](newStore.state, ...args) as S;
        subscribers.broadcast(key);
      };
    } else {
      // @ts-ignore
      newStore.actions[key] = async (...args: any[]) => {
        newStore.state = await actions[key](newStore.state, ...args);
        subscribers.broadcast(key);
      };
    }
  });

  return newStore;
};

export default store;
