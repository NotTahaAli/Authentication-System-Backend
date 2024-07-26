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
exports.verify = verify;
function verify(token) {
    return __awaiter(this, void 0, void 0, function* () {
        switch (token) {
            case "ABC":
                return { googleId: 1, email: "abc@gmail.com" };
            case "ABC3":
                return { googleId: 2, email: "abc3@gmail.com" };
            case "ABC1":
                return { googleId: 3, email: "abc1@gmail.com" };
            case "ABC2":
                return { googleId: 4, email: "abc2@gmail.com" };
            default:
                return null;
        }
    });
}
