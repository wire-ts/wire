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

export const root = rootStore({
  counter,
});
