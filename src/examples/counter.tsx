import { rootStore, store } from "..";

interface Todo {
  id: number;
  task: string;
  done: boolean;
}

const todos = store({ list: [] as Todo[] })
  .actions({
    add: (state, newItem: Todo) => ({
      ...state,
      list: [...state.list, newItem],
    }),
  })
  .selectors({
    incomplete: (state) => state.list.filter((t) => !t.done),
  });

export const root = rootStore({
  todos,
});
