import React from "react";
import { keys, Store } from "./common";
export { store } from "./mutable";

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
      mounted = false;
      unsubs: Array<() => void> = [];

      rerender = () => this.mounted && this.forceUpdate();

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
