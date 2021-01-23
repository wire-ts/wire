import { rootStore, store } from "..";

export const counter = store({
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
