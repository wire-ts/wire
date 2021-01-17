import { keys } from "./common";

type Store<S, I> = Readonly<{
  state: Readonly<S>;
  subscribe: (f: () => void) => () => void;
} & I>;

type InputStore<S, I extends Record<string, any>> = Readonly<
  { [k in keyof I]: I[k] } & { state: S }
>;

export const store = <S, I extends object>(
  input: InputStore<S, I>
): Store<S, I> => {
  const subscribers = new Map<number, () => void>();
  const broadcast = () => {
    for (const callback of subscribers.values()) {
      callback();
    }
  };

  const newStore = {
    ...input,
    subscribe: (f) => {
      const index = subscribers.size;
      subscribers.set(index, f);
      return () => subscribers.delete(index);
    },
  } as Store<S, I>;

  keys(input).forEach((key) => {
    if (
      key !== "state" &&
      (input[key] as any).constructor.name === "Function"
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
