import React from "react";
import { store as pure } from "../pure";
import { rootStore } from "..";

export const counter = pure({
  state: { counter: 0 },
  incrementBy: (state, x: number) => ({
    counter: state.counter + x,
  }),
  async load(state, id: number) {
    const fakeAPIResponse = await Promise.resolve(id);
    return {
      ...state,
      counter: fakeAPIResponse,
    };
  },
});

const root = rootStore({
  counter,
});

export const CounterComponent = (_props: { x: number }) => {
  const { incrementBy, state } = root.useStore((s) => s.counter);

  return <div onClick={() => incrementBy(1)}>{state.counter}</div>;
};
