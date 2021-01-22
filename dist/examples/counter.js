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
const pure_1 = require("../pure");
const __1 = require("..");
exports.counter = pure_1.store({
    state: { counter: 0 },
    incrementBy: (state, x) => ({
        counter: state.counter + x,
    }),
    load(state, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const fakeAPIResponse = yield Promise.resolve(id);
            return Object.assign(Object.assign({}, state), { counter: fakeAPIResponse });
        });
    },
});
exports.root = __1.rootStore({
    counter: exports.counter,
});
