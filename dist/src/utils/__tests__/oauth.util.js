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
const oauth_util_1 = require("../oauth.util");
describe("OAuth Call", () => {
    it("should error if invalid JWT", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, oauth_util_1.verify)("ABCD")).rejects.toThrow("Wrong number of segments in token: ABCD");
    }));
});
