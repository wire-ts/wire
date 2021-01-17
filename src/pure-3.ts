type Store<S, M extends Methods<S>> = Readonly<{
  state: Readonly<S>;
}> &
  {
    [k in keyof M]: M[k] extends (s: any, ...args: infer A) => S
      ? (...args: A) => void
      : M[k] extends (s: any, ...args: infer A) => Promise<S>
      ? (...args: A) => Promise<void>
      : never;
  };

type Methods<S> = Record<
  string,
  S | ((state: S, ...args: any[]) => S | Promise<S>)
>;

type Input<S, M> = {
  state: S;
} & M;

export const store = <S, M extends Methods<S>>(
  _input: Input<S, M>
): Store<S, M> => {
  return {} as any;
};

const pureCounter = store({
  state: { counter: 0 },
  incrementBy: (state, x: number) => ({
    counter: state.counter + x,
  }),
  asyncIncrementBy: async (state, x: number) => {
    const fetched = await Promise.resolve(1);
    return {
      ...state,
      counter: fetched + x,
    };
  },
});

pureCounter.asyncIncrementBy(1);
