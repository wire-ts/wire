import { rootStore, store } from "..";

export const counter = store({ i: 0 })
  .actions({
    incrementBy: (state, x: number) => ({ ...state, i: state.i + x }),
    load: async (state, id: string) => ({
      ...state,
      i: await Promise.resolve(parseFloat(id)),
    }),
  })
  .thunks({
    postLogin() {
      counter.actions.load("123");
    },
    test2() {
      this.postLogin();
    },
  });

export const root = rootStore({
  counter,
});
