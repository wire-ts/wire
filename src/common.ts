export type SubscribeFn = ((method: string) => void) | (() => void);

export interface Store<S> {
  state: S;
  subscribe: (f: SubscribeFn) => () => void;
}

export type AllExceptAny =  undefined
  | null
  | boolean
  | string
  | number
  | Function
  | Map<any, any>
  | Set<any>
  | object;

type ImmutablePrimitive =
  | undefined
  | null
  | boolean
  | string
  | number
  | Function;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type Immutable<T> = T extends ImmutablePrimitive
  ? T
  : T extends Map<infer K, infer V>
  ? ImmutableMap<K, V>
  : T extends Set<infer M>
  ? ImmutableSet<M>
  : ImmutableObject<T>;

export const deepCopy = <T extends Array<any> | object>(object: T): T => {
  let outObject: any, value, key;

  if (typeof object !== "object" || object === null) {
    return object; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(object) ? [] : {};

  for (key in object) {
    value = (<any>object)[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopy(value);
  }

  return outObject;
};

export const keys = <T extends object>(object: T) =>
  Object.keys(object) as Array<keyof T>;
