export declare const counter: import("../store").Output.StoreWithThunks<{
    i: number;
}, {
    incrementBy: (state: {
        i: number;
    }, x: number) => {
        i: number;
    };
    load: (state: {
        i: number;
    }, id: string) => Promise<{
        i: number;
    }>;
}, {
    postLogin(store: {
        state: {
            i: number;
        };
        actions: import("../store").Output.Actions<{
            i: number;
        }, {
            incrementBy: (state: {
                i: number;
            }, x: number) => {
                i: number;
            };
            load: (state: {
                i: number;
            }, id: string) => Promise<{
                i: number;
            }>;
        }>;
    }): Promise<void>;
}>;
export declare const root: {
    enableDebugging: () => void;
    getState: () => import("../common").ImmutableObject<{
        counter: import("../store").Output.StoreWithThunks<{
            i: number;
        }, {
            incrementBy: (state: {
                i: number;
            }, x: number) => {
                i: number;
            };
            load: (state: {
                i: number;
            }, id: string) => Promise<{
                i: number;
            }>;
        }, {
            postLogin(store: {
                state: {
                    i: number;
                };
                actions: import("../store").Output.Actions<{
                    i: number;
                }, {
                    incrementBy: (state: {
                        i: number;
                    }, x: number) => {
                        i: number;
                    };
                    load: (state: {
                        i: number;
                    }, id: string) => Promise<{
                        i: number;
                    }>;
                }>;
            }): Promise<void>;
        }>;
    }>;
    useStore<MP>(f: (props: {
        counter: import("../store").Output.StoreWithThunks<{
            i: number;
        }, {
            incrementBy: (state: {
                i: number;
            }, x: number) => {
                i: number;
            };
            load: (state: {
                i: number;
            }, id: string) => Promise<{
                i: number;
            }>;
        }, {
            postLogin(store: {
                state: {
                    i: number;
                };
                actions: import("../store").Output.Actions<{
                    i: number;
                }, {
                    incrementBy: (state: {
                        i: number;
                    }, x: number) => {
                        i: number;
                    };
                    load: (state: {
                        i: number;
                    }, id: string) => Promise<{
                        i: number;
                    }>;
                }>;
            }): Promise<void>;
        }>;
    }) => MP): import("../common").Immutable<MP>;
};
