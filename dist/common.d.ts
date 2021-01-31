export declare type SubscribeFn = ((method: string) => void) | (() => void);
export interface Store<S> {
    state: S;
    subscribe: (f: SubscribeFn) => () => void;
}
declare type ImmutablePrimitive = undefined | null | boolean | string | number | Function;
export declare type ImmutableMap<K, V> = ReadonlyMap<Immutable<K>, Immutable<V>>;
export declare type ImmutableSet<T> = ReadonlySet<Immutable<T>>;
export declare type ImmutableObject<T> = {
    readonly [K in keyof T]: Immutable<T[K]>;
};
export declare type Immutable<T> = T extends ImmutablePrimitive ? T : T extends Map<infer K, infer V> ? ImmutableMap<K, V> : T extends Set<infer M> ? ImmutableSet<M> : ImmutableObject<T>;
export declare const deepCopy: <T extends object | any[]>(object: T) => T;
export declare const keys: <T extends object>(object: T) => (keyof T)[];
export {};