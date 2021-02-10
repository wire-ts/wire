import React from "react";
import { Immutable, keys, Store } from "./common";
import { enable as enableDevtools } from "./devtools";

const rootStore = <T extends Record<string, Store<any>>>(map: T) => {
  return {
    enableDebugging: () => enableDevtools(map),
    getState: () => map as Immutable<T>,
    // connector for hooks
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
    // connector for class-based components
    connect<MP, CP>(
      getProps: (props: T, in_props: CP) => MP,
      Component: React.ComponentType<CP & MP>
    ) {
      return class extends React.PureComponent<CP> {
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
            ...getProps(map, this.props),
          });
        }
      };
    },
  };
};

export default rootStore;
