export declare const counter: Readonly<{
    state: Readonly<{
        counter: number;
    }>;
    subscribe: (f: () => void) => () => void;
}> & Pick<{
    state: never;
    incrementBy: (x: number) => void;
    load: (id: number) => Promise<void>;
}, "incrementBy" | "load">;
export declare const root: import("..").RootStore<{
    counter: Readonly<{
        state: Readonly<{
            counter: number;
        }>;
        subscribe: (f: () => void) => () => void;
    }> & Pick<{
        state: never;
        incrementBy: (x: number) => void;
        load: (id: number) => Promise<void>;
    }, "incrementBy" | "load">;
}>;
