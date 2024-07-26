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
const jwt_util_1 = require("../../utils/jwt.util");
jest.mock("../../db/functions/users");
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = (0, linkRoutes_util_1.linkRoutes)(yield (0, createApp_util_1.createApp)());
}));
describe("GET /", () => {
    it('should return 200 and success=true', (done) => {
        (0, supertest_1.default)(server).get("/")
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body).toMatchObject({ success: true });
            done();
        });
    });
});
describe("POST /", () => {
    it('should return 404 and success=false', (done) => {
        (0, supertest_1.default)(server).post("/")
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.success).toBe(false);
            done();
        });
    });
});
describe("GET /user", () => {
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .set("Authorization", "ABCDEF")
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .set("Authorization", (0, jwt_util_1.createJWT)({}, '1m'))
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 1, iat: Math.floor(Date.now() / 1000) - 120 }, '10m'))
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 2, iat: Math.floor(Date.now() / 1000) - 120 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 200 and user info", (done) => {
        (0, supertest_1.default)(server).get("/user")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.message).toHaveProperty("username");
            expect(res.body.message.username).toEqual("abc");
            done();
        });
    });
});
