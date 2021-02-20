import { rootStore, store } from "..";

export const counter = store({ i: 0 })
  .actions({
    incrementBy: (state, x: number) => ({ ...state, i: state.i + x }),
    load: (state, id: string) => ({
      ...state,
      i: 1,
    }),
  })
  .thunks({
    postLogin(x) {
      counter.actions.load("123");
    },
    test2() {},
  });

export const root = rootStore({
  counter,
});
