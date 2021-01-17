export type Store<S> = Readonly<
  {
    state: Readonly<S>;
    subscribe: (f: () => void) => () => void;
  }
>;

export const keys = <T extends object>(o: T) =>
  Object.keys(o) as Array<keyof T>;
