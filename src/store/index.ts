import { Immutable } from "../common";
import { Input, Output } from "./types";
import Subscribers from "./subscribers";

const createStore = <S>(initialState: S): Input.StoreWithState<S> => ({
  actions: <A extends Input.Actions<S>>(actions: A) => {
    const subscribers = new Subscribers();

    const store: Output.Store<S, A, null, null> = {
      state: initialState as Immutable<S>,
      subscribe: subscribers.add,
      actions: {} as Output.Actions<S, A>,
      thunks: <T extends Input.Thunks>(thunks: T) => {
        (store as any).thunks = thunks;
        return store as Output.Store<S, A, Output.Thunks<T>, null>;
      },
      selectors: <I extends Input.Selectors<S>>(selectors: I) => {
        (store as any).selectors = selectors;
        return store as Output.Store<S, A, null, Output.Selectors<S, I>>;
      },
    };

    store.actions = transformActions(store, subscribers.broadcast, actions);

    return store;
  },
});

const transformActions = <S, A extends Input.Actions<S>, St extends Output.Store<S, A, any, any>>(
  store: St,
  broadcast: (method: string) => void,
  actions: A
) => {
  const newActions = {} as Record<keyof A, Function>;

  for (const [key, action] of Object.entries(actions)) {
    newActions[key as keyof A] = (...args: never[]) => {
      store.state = action(store.state, ...args);
      broadcast(key);
    };
  }

  return newActions as Output.Actions<S, A>;
};

export default createStore;
