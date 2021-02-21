import { Immutable } from "../common";
import { Input, Output } from "./types";
import Subscribers from "./subscribers";

const createStore = <S>(initialState: S): Input.StoreWithState<S> => ({
  actions: <A extends Input.Actions<S>>(actions: A) => {
    const subscribers = new Subscribers();

    const store: Output.Store<S, A, null, null> = {
      state: initialState as Immutable<S>,
      subscribe: subscribers.add,
      actions: Object.entries(actions).reduce(
        (acc, [key, action]) => ({
          ...acc,
          [key]: (...args: never[]) => {
            store.state = action(store.state, ...args);
            subscribers.broadcast(key);
          },
        }),
        {} as Output.Actions<S, A>
      ),
      thunks: <T extends Input.Thunks>(thunks: T) => {
        (store as any).thunks = thunks;
        return store as Output.Store<S, A, Output.Thunks<T>, null>;
      },
      selectors: <I extends Input.Selectors<S>>(selectors: I) => {
        const castStore = store as Output.Store<
          S,
          A,
          null,
          Output.Selectors<S, I>
        >;

        for (const [key, selector] of Object.entries(selectors)) {
          (castStore.selectors as Output.Selectors<S, I>)[key as keyof I] = ((
            ...args: never[]
          ) => selector(store.state, ...args)) as Output.Selectors<
            S,
            I
          >[keyof Output.Selectors<S, I>];
        }

        return castStore;
      },
    };

    return store;
  },
});

export default createStore;
