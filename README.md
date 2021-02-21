# Wire

Wire is a state management library for React that emphasizes type safety and fast iteration.

## Features

- No boilerplate 
- Async thunks included
- Selectors
- Only one way of doing things which is type-safe and easy to understand
- Mutations are type errors
- React hooks


## Examples

### Basic Store with Actions

```ts
import { store } from "@wire-ts/wire";

interface Todo {
  id: number;
  task: string;
  done: boolean;
}

export default store({ list: [] as Todo[] }).actions({
  add: (state, todo: Todo) => ({
    list: [...state.list, todo],
  }),
  remove: (state, id: number) => ({
    list: state.list.filter(todo => todo.id !== id),
  }),
});
```

### Full-Featured Store with Actions, Thunks, Selectors

```ts
import { store } from "@wire-ts/wire";

interface Todo {
  id: number;
  task: string;
  done: boolean;
}

const todos = store({ list: [] as Todo[] }).actions({
  load: (state, todos: Todo[]) => ({ ...state, list: todos }),
  add: (state, todo: Todo) => ({
    list: [...state.list, todo],
  }),
  remove: (state, id: number) => ({
    list: state.list.filter(todo => todo.id !== id),
  }),
}).thunks({
  load: async () => {
    const items = await yourAPICall();
    todos.actions.load(items);
  },
  remove123: (someArg: boolean) => {
    console.log(todos.state);
    todos.actions.remove(123);
  }
}).selectors({
  incomplete: (state) => state.list.filter(t => !t.done)
});
```
