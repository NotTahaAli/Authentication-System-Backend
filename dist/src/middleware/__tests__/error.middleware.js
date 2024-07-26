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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const createApp_util_1 = require("../../utils/createApp.util");
const linkRoutes_util_1 = require("../../utils/linkRoutes.util");
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = yield (0, createApp_util_1.createApp)();
    server.get("/customErrorPage", () => {
        throw { status: 400, message: "Hello" };
    });
    server.get("/defaultErrorPage", () => {
        throw {};
    });
    (0, linkRoutes_util_1.linkRoutes)(server);
}));
describe("GET /customErrorPage", () => {
    it('should return 400 and error="Hello"', (done) => {
        (0, supertest_1.default)(server).get("/customErrorPage")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Hello");
            expect(res.body.success).toBe(false);
            done();
        });
    });
});
describe("GET /defaultErrorPage", () => {
    it('should return 500 and error=undefined', (done) => {
        (0, supertest_1.default)(server).get("/defaultErrorPage")
            .expect('Content-Type', /json/)
            .expect(500)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toBeUndefined();
            expect(res.body.success).toBe(false);
            done();
        });
    });
});
