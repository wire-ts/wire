import { SubscribeFn } from "./common";

type Store<S, M extends Methods<S>> = Readonly<{
  state: Readonly<S>;
  subscribe: (f: SubscribeFn) => () => void;
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
  Record<
    string,
    S | ((this: unknown, state: Readonly<S>, ...args: any[]) => S | Promise<S>)
  >
>;

type Input<S, M> = Readonly<{
  state: S;
}> &
  M;

const store = <S, M extends Methods<S>>(
  input: Input<S, M>
): Store<S, M> => {
  const subscribers = new Map<number, SubscribeFn>();
  let i = 0;

  const broadcast = (method: string) => {
    for (const callback of subscribers.values()) {
      callback(method);
    }
  };

  const newStore = {
    state: input.state,
    subscribe: (f: SubscribeFn) => {
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
          broadcast(key);
        };
        break;

      case "AsyncFunction":
        // @ts-ignore
        newStore[key] = async (...args: any[]) => {
          // @ts-ignore
          newStore.state = await input[key](newStore.state, ...args);
          broadcast(key);
        };
        break;
    }
  });

  return (newStore as any) as Store<S, M>;
};

export default store;
