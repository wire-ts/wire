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
    subscribe: (f: () => void) => void;
  } & Omit<I, "state">
>;

export const keys = <T extends object>(o: T) =>
  Object.keys(o) as Array<keyof T>;

export const createStore = <S extends object, I extends object>(
  input: InputStore<S, I>
): Store<S, I> => {
  const subscribers = [] as Array<() => void>;
  const broadcast = () => subscribers.forEach((f) => f());

  const newStore = {
    ...input,
    subscribe: (f) => {
      subscribers.push(f);
    },
  } as Store<S, I>;

  keys(input)
    .filter(
      (k) => !(k === "state" || input[k].constructor.name === "AsyncFunction")
    )
    .forEach((key: any) => {
      newStore[key] = (...args: any[]) => {
        input[key](...args);
        broadcast();
      };
    });

  return newStore;
};
