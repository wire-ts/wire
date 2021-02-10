import { Store, deepCopy, keys } from "./common";

const getStateTree = <T extends Record<string, Store<any>>>(root: T) =>
  keys(root).reduce(
    (acc, key) => ({ ...acc, [key]: deepCopy(root[key].state) }),
    {} as { [k in keyof T]: T[k]["state"] }
  );

export const enable = <T extends Record<string, Store<any>>>(map: T) => {
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
      extensionReady = true;
      outstandingMsgs.forEach(postMessage);
      outstandingMsgs = [];
    }
  });
};
