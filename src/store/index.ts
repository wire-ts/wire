import { keys } from "../common";
import { Input, Output } from "./types";
import Subscribers from "./subscribers";

const createStore = <S>(initialState: S): Input.StoreWithState<S> => ({
  actions: <A extends Input.Actions<S>>(actions: A) => {
    const subscribers = new Subscribers();

    const store: Output.BasicStore<S, A> = {
      state: initialState,
      subscribe: subscribers.add,
      actions: {} as Output.Actions<S, A>,
      thunks: (thunks) =>
        transformThunks(store, subscribers.broadcast, thunks),
    };

    store.actions = transformActions(
      store,
      subscribers.broadcast,
      actions
    );

    return store;
  },
});

const transformActions = <S, A extends Input.Actions<S>>(
  store: Output.BasicStore<S, A>,
  broadcast: (method: string) => void,
  actions: A
) => {
  const newActions = {} as Output.Actions<S, A>;
  keys(actions).forEach((key) => {
    if (actions[key].constructor.name === "Function") {
      // @ts-ignore
      newActions[key] = (...args: any[]) => {
        store.state = actions[key](store.state, ...args) as S;
        broadcast(key);
      };
    } else {
      // @ts-ignore
      newActions[key] = async (...args: any[]) => {
        store.state = await actions[key](store.state, ...args);
        broadcast(key);
      };
    }
  });

  return newActions;
};

const transformThunks = <
  S,
  A extends Input.Actions<S>,
  T extends Input.Thunks<S, A>
>(
  store: Output.BasicStore<S, A>,
  broadcast: (method: string) => void,
  thunks: T
): Output.StoreWithThunks<S, A, T> => {
  const storeWithThunks = (store as any) as Output.StoreWithThunks<S, A, T>;

  storeWithThunks.thunks = keys(thunks).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (...args: any[]) => {
        thunks[key](storeWithThunks as any, ...args);
        broadcast(key);
      },
    }),
    {} as Output.Thunks<S, A, T>
  );

  return storeWithThunks;
};

export default createStore;
