import React from "react";

export { store } from "./pure";

interface Store<S> {
  state: S;
  subscribe: (f: () => void) => () => void;
}

export const rootStore = <S extends Store<any>, T extends Record<string, S>>(
  map: T
) => ({
  data: map,
  getState: () => map,
  useStore<MP>(f: (props: T) => MP) {
    const [computed, setComputed] = React.useState<MP>(f(map));
    const updateProps = () => {
      setComputed(f(map));
    };

    React.useEffect(() => {
      const unsubs = Object.keys(map).map((k) => map[k].subscribe(updateProps));

      return () => {
        unsubs.forEach((unsub) => unsub());
      };
    }, []);

    return computed;
  },
});
