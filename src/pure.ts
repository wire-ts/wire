type Store<S, M extends Methods<S>> = Readonly<{
  state: Readonly<S>;
  subscribe: (f: () => void) => () => void;
}> &
  Omit<
    {
      [k in keyof M]: M[k] extends (s: any, ...args: infer A) => S
        ? (...args: A) => void
        : M[k] extends (s: any, ...args: infer A) => Promise<S>
        ? (...args: A) => Promise<void>
        : never;
    },
    "state"
  >;

type Methods<S> = Readonly<
  Record<string, S | ((state: Readonly<S>, ...args: any[]) => S | Promise<S>)>
>;

type Input<S, M> = Readonly<{
  state: S;
}> &
  M;

export const store = <S, M extends Methods<S>>(
  input: Input<Readonly<S>, M>
): Store<S, M> => {
  const subscribers = new Map<number, () => void>();
  let i = 0;

  const broadcast = () => {
    for (const callback of subscribers.values()) {
      callback();
    }
  };

  const newStore = {
    state: input.state,
    subscribe: (f: () => void) => {
      const index = i;
      subscribers.set(index, f);
      i++;

      return () => subscribers.delete(index);
    },
  };

  Object.keys(input).forEach((key) => {
    if (key === "state") {
      return;
    }

    const constructor = (input[key] as Function).constructor.name;

    switch (constructor) {
      case "Function":
        // @ts-ignore
        newStore[key] = (...args: any[]) => {
          // @ts-ignore
          newStore.state = input[key](newStore.state, ...args);
          broadcast();
        };
        break;

      case "AsyncFunction":
        // @ts-ignore
        newStore[key] = async (...args: any[]) => {
          // @ts-ignore
          newStore.state = await input[key](newStore.state, ...args);
          broadcast();
        };
        break;
    }
  });

  return (newStore as any) as Store<S, M>;
};
