import { store as pure } from "../pure";

export const pureCounter = pure({
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

pureCounter.incrementBy(1);
