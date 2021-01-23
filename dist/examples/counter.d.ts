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
export declare const root: {
    data: {
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
    };
    getState: () => {
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
    };
    useStore<MP>(f: (props: {
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
    }) => MP): import("../helper-types").Immutable<MP>;
};
