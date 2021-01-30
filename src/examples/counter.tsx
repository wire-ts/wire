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
    async postLogin(store) {
      await store.actions.load("123");
    },
  });

export const root = rootStore({
  counter,
});
