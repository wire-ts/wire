import { createStore } from "../store"
const counterStore = createStore({
  state: { counter: 0 },
  increment() {
    this.incrementBy(1);
  },
  decrement() {
    this.incrementBy(-1);
  },
  incrementBy(x: number) {
    this.state.counter += x;
  },
  async load() {
    this.incrementBy(1);
  },
});
