import { Immutable, Store } from "./common";
import React from "react";

const createHook = <T extends Record<string, Store<any>>>(map: T) => <MP>(
  f: (props: T) => MP
) => {
  const [computed, setComputed] = React.useState<MP>(f(map));
  const [_, forceUpdate] = React.useReducer((x) => x + 1, 0);

  const updateProps = () => {
    setComputed(f(map));
    forceUpdate();
  };

  React.useEffect(() => {
    const unsubs = Object.keys(map).map((k) =>
      map[k as keyof T].subscribe(updateProps)
    );

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  return computed as Immutable<MP>;
};

export default createHook;
