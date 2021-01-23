export declare const counter: Readonly<{
    state: Readonly<{
        counter: number;
    }>;
    subscribe: (f: import("../common").SubscribeFn) => () => void;
}> & Pick<{
    state: never;
    incrementBy: (x: number) => void;
    load: (id: number) => Promise<void>;
}, "incrementBy" | "load">;
export declare const root: {
    getState: () => import("../common").ImmutableObject<{
        counter: Readonly<{
            state: Readonly<{
                counter: number;
            }>;
            subscribe: (f: import("../common").SubscribeFn) => () => void;
        }> & Pick<{
            state: never;
            incrementBy: (x: number) => void;
            load: (id: number) => Promise<void>;
        }, "incrementBy" | "load">;
    }>;
    useStore<MP>(f: (props: {
        counter: Readonly<{
            state: Readonly<{
                counter: number;
            }>;
            subscribe: (f: import("../common").SubscribeFn) => () => void;
        }> & Pick<{
            state: never;
            incrementBy: (x: number) => void;
            load: (id: number) => Promise<void>;
        }, "incrementBy" | "load">;
    }) => MP): import("../common").Immutable<MP>;
};
