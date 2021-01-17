type Store<S, M extends Methods<S>> = Readonly<{
  state: Readonly<S>;
}> & {
  methods: {
    [k in keyof M]: M[k] extends (s: any, ...args: infer A) => S
      ? (...args: A) => void
      : never;
  };
};

type Methods<S> = Record<string, (state: S, ...args: any[]) => S>;

interface Input<S, M, T> {
  state: S;
  methods: M;
  thunks?: T;
}

export const store = <
  S,
  M extends Record<string, (state: S, ...args: any[]) => S>,
  T extends Record<string, (this: Store<S, M>, ...args: any[]) => Promise<void>>
>(
  _input: Input<S, M, T>
): Store<S, M> => {
  return {} as any;
};

const pureCounter = store({
  state: { counter: 0 },
  methods: {
    incrementBy: (state, x: number) => ({
      counter: state.counter + x,
    }),
  },
  thunks: {
    async load(id: number) {
    await Promise.resolve();
      this.methods.incrementBy(1);
    },
  },
});

pureCounter.methods.incrementBy(1);
