"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.root = exports.counter = void 0;
const __1 = require("..");
exports.counter = __1.store({ i: 0 })
    .actions({
    incrementBy: (state, x) => (Object.assign(Object.assign({}, state), { i: state.i + x })),
    load: (state, id) => __awaiter(void 0, void 0, void 0, function* () {
        return (Object.assign(Object.assign({}, state), { i: yield Promise.resolve(parseFloat(id)) }));
    }),
})
    .thunks({
    postLogin(store) {
        return __awaiter(this, void 0, void 0, function* () {
            yield store.actions.load("123");
        });
    },
});
exports.root = __1.rootStore({
    counter: exports.counter,
});
