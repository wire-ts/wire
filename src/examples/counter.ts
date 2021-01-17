import { store } from "..";
import { store as pure } from "../pure";

export const mutable = store({
  state: { counter: 0 },
  incrementBy(x: number) {
    this.state.counter += x;
  },
});
mutable.incrementBy(1);

 export const pureCounter = pure({
   state: { counter: 0 },
   methods: {
     incrementBy: (state, x: number) => ({
       counter: state.counter + x,
     }),
   },
   thunks: {
     async load(id: number) {
       this.methods.incrementBy(1);
     },
   },
 });

 pureCounter.incrementBy(1);
