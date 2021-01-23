declare type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
export declare type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export declare type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export declare type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};
export declare type Immutable<T> = T extends ImmutablePrimitive ? T : T extends Map<infer K, infer V> ? ImmutableMap<K, V> : T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;
export {};
