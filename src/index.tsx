import React from "react";

export { store } from "./pure";

interface Store<S> {
  state: S;
  subscribe: (f: () => void) => () => void;
}

export interface RootStore<T extends Record<string, Store<any>>> {
  data: T;
  getState: () => T;
}

export function useStore<R extends RootStore<any>, MP>(
  store: R,
  f: (props: R["data"]) => MP
): MP {
  const map = store.data;
  const [computed ] = React.useState<MP>(f(map));
  //const updateProps = () => setComputed(f(map));

  return computed;
}

export const rootStore = <S extends Store<any>, T extends Record<string, S>>(
  map: T
): RootStore<T> => ({
  data: map,
  getState: () => map,
});
