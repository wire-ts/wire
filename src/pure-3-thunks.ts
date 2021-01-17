/// --------------------------------
type Methods<S> = Record<string, (state: S, ...args: any[]) => S>;

type TransformMethods<S, M extends Methods<S>> = {
  actions: {
    [k in keyof M]: M[k] extends (s: any, ...args: infer A) => S
      ? (...args: A) => void
      : never;
  };
};
/// --------------------------------
/// --------------------------------
type Thunks<S, M extends Methods<S>, T extends Thunks<any, any, any>> = Record<
  string,
  (this: Store<S, M, T>, ...args: any[]) => Promise<void>
>;
type TransformThunks<S, M extends Methods<S>, T extends Thunks<S, M, T>> = {
  thunks: T;
};

/// --------------------------------

type Store<S, M extends Methods<S>, T extends Thunks<S, M, T>> = Readonly<{
  state: Readonly<S>;
}> &
  TransformMethods<S, M> &
  TransformThunks<S, M, T>;

type Input<S, M, T> = {
  state: S;
  actions: M;
  thunks?: T;
};

export const store = <S, M extends Methods<S>, T extends Thunks<S, M, T>>(
  _input: Input<S, M, T>
): Store<S, M, T> => {
  return {} as any;
};

const pureCounter = store({
  state: { counter: 0 },
  actions: {
    incrementBy: (state, x: number) => ({
      counter: state.counter + x,
    }),
  },
  thunks: {
    async load() {
      await Promise.resolve();
      this.actions.a();
    },
  },
});

pureCounter.actions.incrementBy(1);
