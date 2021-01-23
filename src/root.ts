import React from "react";
import { Immutable, Store } from "./common";

const rootStore = <T extends Record<string, Store<any>>>(map: T) => {
  // @ts-ignore
  if (window._WIRE_EXTENSION !== undefined) {
    // @ts-ignore
    const log = window._WIRE_EXTENSION;
    Object.keys(map).map((k) =>
      map[k].subscribe((method) => log(`${k}.${method}`))
    );
  }

  return {
    getState: () => map as Immutable<T>,
    useStore<MP>(f: (props: T) => MP) {
      const [computed, setComputed] = React.useState<MP>(f(map));
      const updateProps = () => {
        setComputed(f(map));
      };

      React.useEffect(() => {
        const unsubs = Object.keys(map).map((k) =>
          map[k].subscribe(updateProps)
        );

        return () => {
          unsubs.forEach((unsub) => unsub());
        };
      }, []);

      return computed as Immutable<MP>;
    },
  };
};

export default rootStore;
