type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
export type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export type ImmutableObject<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export type Immutable<T> =
  T extends ImmutablePrimitive ? T :
  T extends Map<infer K, infer V> ? ImmutableMap<K, V> :
  T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;
