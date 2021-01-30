import React from "react";
import { Immutable, Store, deepCopy, keys } from "./common";

const getStateTree = <T extends Record<string, Store<any>>>(root: T) =>
  keys(root).reduce(
    (acc, key) => ({ ...acc, [key]: deepCopy(root[key].state) }),
    {} as { [k in keyof T]: T[k]["state"] }
  );

const rootStore = <T extends Record<string, Store<any>>>(map: T) => {
  return {
    enableDebugging: () => {
      const stateMap = getStateTree(map);
      let extensionReady = false;
      let outstandingMsgs: object[] = [];

      const postMessage = (msg: object) => {
        if (extensionReady) {
          window.postMessage(msg, "*");
        } else {
          outstandingMsgs.push(msg);
        }
      };

      postMessage({
        type: "WIRE_INIT",
        stateMap,
      });

      keys(map).map((k) =>
        map[k].subscribe((method) => {
          postMessage({
            type: "WIRE_CHANGE",
            store: k,
            method,
            oldState: deepCopy(stateMap[k]),
            newState: deepCopy(map[k].state),
          });

          stateMap[k] = deepCopy(map[k].state);
        })
      );

      window.addEventListener("message", (e) => {
        if (typeof e.data === "object" && e.data.type === "WIRE_EXT_READY") {
          console.log("READY", outstandingMsgs);
          extensionReady = true;
          outstandingMsgs.forEach((m) => postMessage(m));
          outstandingMsgs = [];
        }
      });
    },
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
