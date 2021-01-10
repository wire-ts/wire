type InputStore<S extends object, I extends object> = { state: S } & {
  [k in keyof I]: k extends "state"
    ? S
    : I[k] extends (this: InputStore<S, I>, ...args: infer Args) => infer O
    ? (this: InputStore<S, I>, ...args: Args) => O
    : I[k];
};

export type Store<S, I extends object> = Readonly<
  {
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
  } & Omit<I, "state">
>;

export const keys = <T extends object>(o: T) =>
  Object.keys(o) as Array<keyof T>;

export const createStore = <S extends object, I extends object>(
  input: InputStore<S, I>
): Store<S, I> => {
  let i = 0;
  const subscribers = new Map<number, () => void>();
  const broadcast = () => {
    for (const callback of subscribers.values()) {
      callback();
    }
  };

  const newStore = {
    ...input,
    subscribe: (f) => {
      const index = i;
      subscribers.set(index, f);
      i++;
      return () => subscribers.delete(index);
    },
  } as Store<S, I>;

  keys(input).forEach((key) => {
    if (
      key !== "state" &&
      (input[key] as Function).constructor.name === "Function"
    ) {
      // @ts-ignore
      newStore[key] = (...args: any[]) => {
        // @ts-ignore
        input[key](...args);
        broadcast();
      };
    }
  });

  return newStore;
};
