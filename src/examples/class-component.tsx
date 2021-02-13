import { root } from "./counter";
import { Props } from "../class-connect";
import React from "react";

interface InProps {
  id: number;
}

const connect = root.connect((r) => ({ ...r.counter }));

class App extends React.Component<InProps & Props<typeof connect>> {
  render() {
    const {
      state: { i },
    } = this.props;

    return <div>{i}</div>;
  }
}

export const Connected = connect(App);

export const Test = () => <Connected id={1} />;

