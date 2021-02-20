import { root } from "./counter";
import { Props } from "../class-connect";
import React from "react";

interface InProps {
  id: number;
}

const connect = root.connect((r, _: InProps) => r.todos);

class App extends React.Component<Props<typeof connect>> {
  render() {
    const { state: { list }, } = this.props;
    return <div>{list.length}</div>;
  }
}

export const Connected = connect(App);

export const Test = () => <Connected id={1} />;
