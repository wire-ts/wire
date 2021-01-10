import React from "react";
import { keys, Store } from "./store";
export { createStore as store } from "./store";

export const rootStore = <S extends Record<string, Store<any, any>>>(
  map: S
) => ({
  getState: () => map,
  connect: function <MP, CP>(
    getProps: (props: S, in_props: CP) => MP,
    Component: React.ComponentType<CP & MP>
  ) {
    return class extends React.PureComponent<CP> {
      static displayName = `Wired${Component.displayName}`;
      private mounted = false;
      private unsubs: Array<() => void> = [];

      private rerender = () => this.mounted && this.forceUpdate();

      componentDidMount() {
        this.mounted = true;
        this.unsubs = keys(map).map((k) => map[k].subscribe(this.rerender));
      }

      componentWillUnmount() {
        this.mounted = false;
        this.unsubs.forEach((unsub) => unsub());
        this.unsubs = [];
      }

      render() {
        return <Component {...this.props} {...getProps(map, this.props)} />;
      }
    };
  },
});
