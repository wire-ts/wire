import { Immutable } from "../common";
import { Input, Output } from "./types";
import Subscribers from "./subscribers";

const createStore = <S>(initialState: S): Input.StoreWithState<S> => ({
  actions: <A extends Input.Actions<S>>(actions: A) => {
    const subscribers = new Subscribers();

    const store: Output.BasicStore<S, A> = {
      state: initialState as Immutable<S>,
      subscribe: subscribers.add,
      actions: {} as Output.Actions<S, A>,
      thunks: <T extends Input.Thunks>(thunks: T) => {
        (store as any).thunks = thunks;
        return (store as any) as Output.StoreWithThunks<S, A, T>;
      },
    };

    store.actions = transformActions(store, subscribers.broadcast, actions);

    return store;
  },
});

const transformActions = <S, A extends Input.Actions<S>>(
  store: Output.BasicStore<S, A>,
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
