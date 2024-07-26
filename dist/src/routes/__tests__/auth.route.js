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
const connected_accounts_1 = __importDefault(require("../../db/functions/connected_accounts"));
const users_1 = __importDefault(require("../../db/functions/users"));
const mail_util_1 = require("../../utils/mail.util");
const crypto_1 = require("crypto");
const rsa_util_1 = require("../../utils/rsa.util");
jest.mock("../../db/functions/users");
jest.mock("../../db/functions/connected_accounts");
jest.mock("../../utils/captcha.util.ts");
jest.mock("../../utils/oauth.util.ts");
jest.mock("../../utils/mail.util.ts", () => ({
    sendVerificationMail: jest.fn((email) => __awaiter(void 0, void 0, void 0, function* () { })),
    sendResetMail: jest.fn((email, user_id) => __awaiter(void 0, void 0, void 0, function* () { })),
    send2FAMail: jest.fn(() => __awaiter(void 0, void 0, void 0, function* () { return (0, crypto_1.randomInt)(100000, 999999); }))
}));
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = (0, linkRoutes_util_1.linkRoutes)(yield (0, createApp_util_1.createApp)());
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    jest.clearAllMocks();
}));
describe("GET /auth/", () => {
    it('should return 200 and success=true', (done) => {
        (0, supertest_1.default)(server).get("/auth/")
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
describe("POST /auth/sign-up", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Captcha Token Missing.");
            done();
        });
    });
    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Captcha Token.");
            done();
        });
    });
    it('should return 400 and message=Username is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Username is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Length of Username can not be less than 3 characters.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "ab" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Length of Username can not be less than 3 characters.");
            done();
        });
    });
    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Email is Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Invalid.");
            done();
        });
    });
    it('should return 400 and message=Password is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Length of Password can not be less than 8 characters.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "1234567" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Length of Password can not be less than 8 characters.");
            done();
        });
    });
    it('should return 400 and message=Password must contain atleast 1 uppercase letter.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "12345678" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password must contain atleast 1 uppercase letter.");
            done();
        });
    });
    it('should return 400 and message=Password must contain atleast 1 lowercase letter.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "12345678A" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password must contain atleast 1 lowercase letter.");
            done();
        });
    });
    it('should return 400 and message=Password must contain atleast 1 digit.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password must contain atleast 1 digit.");
            done();
        });
    });
    it('should return 400 and message=Password must contain atleast 1 special character.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh1" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password must contain atleast 1 special character.");
            done();
        });
    });
    it('should return 400 and message=Username already used.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Username already used.");
            done();
        });
    });
    it('should return 400 and message=Email already used.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc1", email: "abc@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email already used.");
            done();
        });
    });
    it('should return 200.', (done) => {
        (0, supertest_1.default)(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc1", email: "test2@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            // expect(res.headers.authorization).toBeDefined();
            // expect(verifyJWT(res.headers.authorization).userId).toBe(4);
            done();
        });
    });
});
describe("POST /auth/login", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Captcha Token Missing.");
            done();
        });
    });
    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Captcha Token.");
            done();
        });
    });
    it('should return 400 and message=Username is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Username is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Password is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password is Missing or Invalid.");
            done();
        });
    });
    it('should return 404 and message=Username not found.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc1", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Username not found.");
            done();
        });
    });
    it('should return 401 and message=Invalid Password.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc", password: "ABCDefgh1.2" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Password.");
            done();
        });
    });
    it('should return 401 and message=Email not verified.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc5", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email not verified.");
            done();
        });
    });
    it('should return 401 and message=Need 2FA.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc2", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.headers.twofactorcode).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)((0, rsa_util_1.decrypt)(res.headers.twofactorcode).jwt).twoFactor.userId).toBe(2);
            expect(res.body.error).toEqual("Need 2FA.");
            done();
        });
    });
    it('should return 200.', (done) => {
        (0, supertest_1.default)(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(1);
            done();
        });
    });
});
describe("POST /auth/two-factor", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Captcha Token Missing.");
            done();
        });
    });
    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Captcha Token.");
            done();
        });
    });
    it('should return 400 and message=Two Factor Token Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Two Factor Token Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Invalid Code.', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD" })
            .set("TwoFactorCode", "abc")
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Code.");
            done();
        });
    });
    it('should return 400 and message=Two Factor Token Invalid. if header is wrongly encrypted', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", "abc")
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Two Factor Token Invalid.");
            done();
        });
    });
    it('should return 400 and message=Two Factor Token Invalid. if encrypted header does not have JWT', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({}))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Two Factor Token Invalid.");
            done();
        });
    });
    it('should return 400 and message=Two Factor Token Invalid. if encrypted header has wrong JWT', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: "somestuff" }))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Two Factor Token Invalid.");
            done();
        });
    });
    it('should return 400 and message=Two Factor Token Invalid. if encrypted header jwt with missing info', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: (0, jwt_util_1.createJWT)({}) }))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Two Factor Token Invalid.");
            done();
        });
    });
    it('should return 404 and message=User not found. if encrypted header jwt user doesnt exist', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: (0, jwt_util_1.createJWT)({ twoFactor: { userId: 7, code: 502123 } }) }))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("User not found.");
            done();
        });
    });
    it('should return 400 and message=Invalid Code. if the code entered by user and header dont match', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: (0, jwt_util_1.createJWT)({ twoFactor: { userId: 2, code: 502123 } }) }))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Code.");
            done();
        });
    });
    it('should return 200 if the code entered by user and header match', (done) => {
        (0, supertest_1.default)(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 502123 })
            .set("TwoFactorCode", (0, rsa_util_1.encrypt)({ jwt: (0, jwt_util_1.createJWT)({ twoFactor: { userId: 2, code: 502123 } }) }))
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(2);
            done();
        });
    });
});
describe("PATCH /auth/two-factor", () => {
    it("should return 401 and error=UnAuthorized", (done) => {
        (0, supertest_1.default)(server).patch("/auth/two-factor")
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        });
    });
    it("should return 400 and error=isEnabled is missing or invalid.", (done) => {
        (0, supertest_1.default)(server).patch("/auth/two-factor")
            .set("Content-Type", "application/json")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("isEnabled is missing or invalid.");
            done();
        });
    });
    it("should return 400 and error=isEnabled is missing or invalid.", (done) => {
        (0, supertest_1.default)(server).patch("/auth/two-factor")
            .send({ isEnabled: "true" })
            .set("Content-Type", "application/json")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("isEnabled is missing or invalid.");
            done();
        });
    });
    it("should return 200 but not call setTwoFactorEnabled", (done) => {
        (0, supertest_1.default)(server).patch("/auth/two-factor")
            .send({ isEnabled: false })
            .set("Content-Type", "application/json")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setTwoFactorEnabled).not.toHaveBeenCalled();
            done();
        });
    });
    it("should return 200 and call setTwoFactorEnabled", (done) => {
        (0, supertest_1.default)(server).patch("/auth/two-factor")
            .send({ isEnabled: false })
            .set("Content-Type", "application/json")
            .set("Authorization", (0, jwt_util_1.createJWT)({ userId: 2 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setTwoFactorEnabled).toHaveBeenCalled();
            done();
        });
    });
});
describe("POST /auth/google-callback", () => {
    it("should return 400 and error=CSRF Token Missing", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("CSRF Token Missing");
            done();
        });
    });
    it("should return 400 and error=CSRF Token Missing", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("CSRF Token Missing");
            done();
        });
    });
    it("should return 400 and error=CSRF Token Mismatch", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCE"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("CSRF Token Mismatch");
            done();
        });
    });
    it("should return 400 and error=Invalid Token.", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it("should return 400 and error=Invalid Token.", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it("should return 400 and error=Invalid Token.", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC0" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it("should return 200", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC2" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).not.toHaveBeenCalled();
            expect(connected_accounts_1.default.addConnectedAccount).toHaveBeenCalled();
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(2);
            done();
        });
    });
    it("should return 200", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC3" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).toHaveBeenCalled();
            expect(connected_accounts_1.default.addConnectedAccount).toHaveBeenCalled();
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(3);
            done();
        });
    });
    it("should return 200", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).not.toHaveBeenCalled();
            expect(connected_accounts_1.default.addConnectedAccount).not.toHaveBeenCalled();
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(1);
            done();
        });
    });
    it("should return 404 and error=Linked account not found. Create one.", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC1" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Linked account not found. Create one.");
            done();
        });
    });
    it("should return 400 and error=Password is Missing or Invalid.", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC1", username: "abc1" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password is Missing or Invalid.");
            done();
        });
    });
    it("should return 200", (done) => {
        (0, supertest_1.default)(server).post("/auth/google-callback")
            .send({ username: "abc1", password: "ABCDefgh1.", g_csrf_token: "ABCD", credential: "ABC1" })
            .set('Content-Type', 'application/json')
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).not.toHaveBeenCalled();
            expect(connected_accounts_1.default.addConnectedAccount).toHaveBeenCalled();
            expect(res.headers.authorization).toBeDefined();
            expect((0, jwt_util_1.verifyJWT)(res.headers.authorization).userId).toBe(4);
            done();
        });
    });
});
describe("POST /auth/verify", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Captcha Token Missing.");
            done();
        });
    });
    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Captcha Token.");
            done();
        });
    });
    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Email is Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "ABCD", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Invalid.");
            done();
        });
    });
    it('should return 400 and message=Already verified', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc2@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Already verified");
            done();
        });
    });
    it('should return 200 but not send email', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc10@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(mail_util_1.sendVerificationMail).not.toHaveBeenCalled();
            done();
        });
    });
    it('should return 200 and send email', (done) => {
        (0, supertest_1.default)(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc5@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(mail_util_1.sendVerificationMail).toHaveBeenCalled();
            done();
        });
    });
});
describe("GET /auth/verify", () => {
    it('should return 400 and token missing', (done) => {
        (0, supertest_1.default)(server).get("/auth/verify")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Token Missing.");
            done();
        });
    });
    it('should return 400 and Invalid Token', (done) => {
        (0, supertest_1.default)(server).get("/auth/verify?code=a")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it('should return 400 and Invalid Token', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({})).toString("base64url");
        (0, supertest_1.default)(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it('should return 400, No error message', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ email: "abc7@gmail.com" })).toString("base64url");
        (0, supertest_1.default)(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).toHaveBeenCalled();
            done();
        });
    });
    it('should return 200.', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ email: "abc@gmail.com" })).toString("base64url");
        (0, supertest_1.default)(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.setEmailVerified).toHaveBeenCalled();
            done();
        });
    });
});
describe("POST /auth/reset-password", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Captcha Token Missing.");
            done();
        });
    });
    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Captcha Token.");
            done();
        });
    });
    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Missing or Invalid.");
            done();
        });
    });
    it('should return 400 and message=Email is Invalid.', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Email is Invalid.");
            done();
        });
    });
    it('should return 200 but not send email', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "abc10@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(mail_util_1.sendResetMail).not.toHaveBeenCalled();
            done();
        });
    });
    it('should return 200 and send email', (done) => {
        (0, supertest_1.default)(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "abc5@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(mail_util_1.sendResetMail).toHaveBeenCalled();
            done();
        });
    });
});
describe("POST /auth/change-password", () => {
    it('should return 400 and token missing', (done) => {
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Token Missing.");
            done();
        });
    });
    it('should return 400 and Invalid Token', (done) => {
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ code: "a" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it('should return 400 and Invalid Token', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({})).toString("base64url");
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Invalid Token.");
            done();
        });
    });
    it('should return 400 and Password is Missing or Invalid', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ resetId: 10 })).toString("base64url");
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Password is Missing or Invalid.");
            done();
        });
    });
    it('should return 404 and User not found.', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ resetId: 10 })).toString("base64url");
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("User not found.");
            done();
        });
    });
    it('should return 401 and Token Expired.', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ resetId: 5, iat: Math.floor(Date.now() / 1000) - 600 })).toString("base64url");
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(res.body.error).toEqual("Token Expired.");
            done();
        });
    });
    it('should return 200.', (done) => {
        const code = Buffer.from((0, jwt_util_1.createJWT)({ resetId: 5 })).toString("base64url");
        (0, supertest_1.default)(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
            if (err)
                return done(err);
            expect(users_1.default.changePassword).toHaveBeenCalled();
            done();
        });
    });
});
