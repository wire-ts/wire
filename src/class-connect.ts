import React from "react";
import { Store, keys } from "common";

export interface ClassConnector<MP> {
  <CP>(Component: React.ComponentType<CP & MP>): React.ComponentType<CP>;
}

export type Props<T> = T extends ClassConnector<infer P> ? P : never;

const makeClassConnector = <T extends Record<string, Store<any>>>(map: T) => <
  MP
>(
  getProps: (props: T) => MP
): ClassConnector<MP> => <CP>(Component: React.ComponentType<CP & MP>) =>
  class extends React.PureComponent<CP> {
    static displayName = `Wired${Component.name}`;
    mounted = false;
    unsubs: Array<() => void> = [];

    rerender = () => {
      if (this.mounted) {
        this.forceUpdate();
      }
    };

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
      return React.createElement(Component, {
        ...this.props,
        ...getProps(map),
      });
    }
  };

export default makeClassConnector;
