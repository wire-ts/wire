import { keys } from "./common";

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
  T extends Record<
    string,
    (this: Store<S, M>, ...args: any[]) => Promise<void>
  >,
  I extends Input<S, M, T>
>(
  input: I
): Store<S, M> => {
  const subscribers = new Map<number, () => void>();
  const broadcast = () => {
    for (const callback of subscribers.values()) {
      callback();
    }
  };

  const newStore = ({
    ...input,
    subscribe: (f: () => void) => {
      const index = subscribers.size;
      subscribers.set(index, f);
      return () => subscribers.delete(index);
    },
  } as any) as Store<S, M>;

  keys(input).forEach((key) => {
    if (
      key !== "state" &&
      (input[key] as any).constructor.name === "Function"
    ) {
      // @ts-ignore
      newStore[key] = (state: S, ...args: any[]) => {
        // @ts-ignore
        newStore.state = input[key](state, ...args);
        broadcast();
      };
    }
  });

  return newStore;
};

// export const store = <S, I extends object>(
//   input: InputStore<S, I>
// ): Store<S, I> => {
//   const subscribers = new Map<number, () => void>();
//   const broadcast = () => {
//     for (const callback of subscribers.values()) {
//       callback();
//     }
//   };
//
//   const newStore = ({
//     ...input,
//     subscribe: (f: () => void) => {
//       const index = subscribers.size;
//       subscribers.set(index, f);
//       return () => subscribers.delete(index);
//     },
//   } as any) as Store<S, I>;
//
//   keys(input).forEach((key) => {
//     if (
//       key !== "state" &&
//       (input[key] as Function).constructor.name === "Function"
//     ) {
//       // @ts-ignore
//       newStore[key] = (state: S, ...args: any[]) => {
//         // @ts-ignore
//         newStore.state = input[key](state, ...args);
//         broadcast();
//       };
//     }
//   });
//
//   return newStore;
// };
