import request from "supertest"
import { Express } from "express";
import { createApp } from "../../utils/createApp.util";
import { linkRoutes } from "../../utils/linkRoutes.util";
import { createJWT, verifyJWT } from "../../utils/jwt.util";
import connected_accounts from "../../db/functions/connected_accounts";
import users from "../../db/functions/users";
import { sendResetMail, sendVerificationMail } from "../../utils/mail.util";
import { randomInt } from "crypto";
import { decrypt, encrypt, getKeys } from "../../utils/rsa.util";
import keys from "../../db/functions/keys";
jest.mock("../../db/functions/users");
jest.mock("../../db/functions/connected_accounts");
jest.mock("../../utils/captcha.util.ts");
jest.mock("../../utils/oauth.util.ts");
jest.mock("../../utils/mail.util.ts", () => ({
    sendVerificationMail: jest.fn(async (email: string) => { }),
    sendResetMail: jest.fn(async (email: string, user_id: number) => { }),
    send2FAMail: jest.fn(async () => { return randomInt(100000, 999999); })
}))
jest.mock('../../db/functions/keys')

let server: Express;

beforeAll(async () => {
    server = linkRoutes(await createApp());
    const localKeys = await getKeys();
    (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>{
        if (type == "public") {
            return {type, key: localKeys.public_key}
        } else if (type == "private") {
            return {type, key: localKeys.private_key}
        }
        return null;
    }));
})

beforeEach(async () => {
    jest.clearAllMocks();
})


describe("GET /auth/", () => {
    it('should return 200 and success=true', (done) => {
        request(server).get("/auth/")
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ success: true });
                done()
            })
    })
})

describe("POST /auth/sign-up", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        request(server).post("/auth/sign-up")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Captcha Token Missing.");
                done();
            })
    })

    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Captcha Token.");
                done();
            })
    })

    it('should return 400 and message=Username is Missing or Invalid.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Username is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Length of Username can not be less than 3 characters.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "ab" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Length of Username can not be less than 3 characters.");
                done();
            })
    })

    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Email is Invalid.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Invalid.");
                done();
            })
    })

    it('should return 400 and message=Password is Missing or Invalid.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Length of Password can not be less than 8 characters.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "1234567" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Length of Password can not be less than 8 characters.");
                done();
            })
    })

    it('should return 400 and message=Password must contain atleast 1 uppercase letter.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "12345678" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password must contain atleast 1 uppercase letter.");
                done();
            })
    })

    it('should return 400 and message=Password must contain atleast 1 lowercase letter.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "12345678A" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password must contain atleast 1 lowercase letter.");
                done();
            })
    })

    it('should return 400 and message=Password must contain atleast 1 digit.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password must contain atleast 1 digit.");
                done();
            })
    })

    it('should return 400 and message=Password must contain atleast 1 special character.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh1" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password must contain atleast 1 special character.");
                done();
            })
    })

    it('should return 400 and message=Username already used.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc", email: "test@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Username already used.");
                done();
            })
    })

    it('should return 400 and message=Email already used.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc1", email: "abc@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email already used.");
                done();
            })
    })

    it('should return 200.', (done) => {
        request(server).post("/auth/sign-up")
            .send({ token: "ABCD", username: "abc1", email: "test2@gmail.com", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                // expect(res.headers.authorization).toBeDefined();
                // expect(verifyJWT(res.headers.authorization).userId).toBe(4);
                done();
            })
    })
})

describe("POST /auth/login", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        request(server).post("/auth/login")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Captcha Token Missing.");
                done();
            })
    })

    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Captcha Token.");
                done();
            })
    })

    it('should return 400 and message=Username is Missing or Invalid.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Username is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Password is Missing or Invalid.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password is Missing or Invalid.");
                done();
            })
    })

    it('should return 404 and message=Username not found.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc1", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Username not found.");
                done();
            })
    })

    it('should return 401 and message=Invalid Password.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc", password: "ABCDefgh1.2" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Password.");
                done();
            })
    })

    it('should return 401 and message=Email not verified.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc5", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email not verified.");
                done();
            })
    })

    it('should return 401 and message=Need 2FA.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc2", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.headers.twofactorcode).toBeDefined();
                expect(res.body.error).toEqual("Need 2FA.");
                decrypt(res.headers.twofactorcode).then(decrypted => {
                    expect(verifyJWT(decrypted.jwt).twoFactor.userId).toBe(2);
                    done();
                }).catch(err => {
                    done(err);
                })
            })
    })

    it('should return 200.', (done) => {
        request(server).post("/auth/login")
            .send({ token: "ABCD", username: "abc", password: "ABCDefgh1." })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(1);
                done();
            })
    })

})

describe("POST /auth/two-factor", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        request(server).post("/auth/two-factor")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Captcha Token Missing.");
                done();
            })
    })

    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        request(server).post("/auth/two-factor")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Captcha Token.");
                done();
            })
    })

    it('should return 400 and message=Two Factor Token Missing or Invalid.', (done) => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Two Factor Token Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Invalid Code.', (done) => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD" })
            .set("TwoFactorCode", "abc")
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Code.");
                done();
            })
    })

    it('should return 400 and message=Two Factor Token Invalid. if header is wrongly encrypted', (done) => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", "abc")
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Two Factor Token Invalid.");
                done();
            })
    })

    it('should return 400 and message=Two Factor Token Invalid. if encrypted header does not have JWT', (done) => {
        encrypt({}).then(encrypted => {
            request(server).post("/auth/two-factor")
                .send({ token: "ABCD", code: 100000 })
                .set("TwoFactorCode", encrypted)
                .set('Content-Type', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(res.body.error).toEqual("Two Factor Token Invalid.");
                    done();
                })
        }).catch(err => done);
    })

    it('should return 400 and message=Two Factor Token Invalid. if encrypted header has wrong JWT', (done) => {
        encrypt({ jwt: "somestuff" }).then(encrypted => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", encrypted)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Two Factor Token Invalid.");
                done();
            })
        }).catch(err => done);
    })

    it('should return 400 and message=Two Factor Token Invalid. if encrypted header jwt with missing info', (done) => {
        encrypt({ jwt: createJWT({}) }).then(encrypted => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", encrypted)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Two Factor Token Invalid.");
                done();
            })
        }).catch(err => done);
    })

    it('should return 404 and message=User not found. if encrypted header jwt user doesnt exist', (done) => {
        encrypt({ jwt: createJWT({ twoFactor: { userId: 7, code: 502123 } }) }).then(encrypted => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", encrypted)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("User not found.");
                done();
            })
        }).catch(err => done);
    })

    it('should return 400 and message=Invalid Code. if the code entered by user and header dont match', (done) => {
        encrypt({ jwt: createJWT({ twoFactor: { userId: 2, code: 502123 } }) }).then(encrypted => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 100000 })
            .set("TwoFactorCode", encrypted)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Code.");
                done();
            })
        }).catch(err => done);
    })

    it('should return 200 if the code entered by user and header match', (done) => {
        encrypt({ jwt: createJWT({ twoFactor: { userId: 2, code: 502123 } }) }).then(encrypted => {
        request(server).post("/auth/two-factor")
            .send({ token: "ABCD", code: 502123 })
            .set("TwoFactorCode", encrypted)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(2);
                done();
            })
        }).catch(err => done);
    })
})

describe("PATCH /auth/two-factor", () => {
    it("should return 401 and error=UnAuthorized", (done) => {
        request(server).patch("/auth/two-factor")
            .expect("Content-Type", /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("UnAuthorized");
                done();
            })
    })

    it("should return 400 and error=isEnabled is missing or invalid.", (done) => {
        request(server).patch("/auth/two-factor")
            .set("Content-Type", "application/json")
            .set("Authorization", createJWT({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("isEnabled is missing or invalid.");
                done();
            })
    })

    it("should return 400 and error=isEnabled is missing or invalid.", (done) => {
        request(server).patch("/auth/two-factor")
            .send({ isEnabled: "true" })
            .set("Content-Type", "application/json")
            .set("Authorization", createJWT({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("isEnabled is missing or invalid.");
                done();
            })
    })

    it("should return 200 but not call setTwoFactorEnabled", (done) => {
        request(server).patch("/auth/two-factor")
            .send({ isEnabled: false })
            .set("Content-Type", "application/json")
            .set("Authorization", createJWT({ userId: 1 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setTwoFactorEnabled).not.toHaveBeenCalled()
                done();
            })
    })

    it("should return 200 and call setTwoFactorEnabled", (done) => {
        request(server).patch("/auth/two-factor")
            .send({ isEnabled: false })
            .set("Content-Type", "application/json")
            .set("Authorization", createJWT({ userId: 2 }, '1m'))
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setTwoFactorEnabled).toHaveBeenCalled()
                done();
            })
    })
})

describe("POST /auth/google-callback", () => {
    it("should return 400 and error=CSRF Token Missing", (done) => {
        request(server).post("/auth/google-callback")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("CSRF Token Missing");
                done();
            })
    })

    it("should return 400 and error=CSRF Token Missing", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("CSRF Token Missing");
                done();
            })
    })

    it("should return 400 and error=CSRF Token Mismatch", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCE"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("CSRF Token Mismatch");
                done();
            })
    })

    it("should return 400 and error=Invalid Token.", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it("should return 400 and error=Invalid Token.", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it("should return 400 and error=Invalid Token.", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC0" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it("should return 200", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC2" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).not.toHaveBeenCalled();
                expect(connected_accounts.addConnectedAccount).toHaveBeenCalled();
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(2);
                done();
            })
    })

    it("should return 200", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC3" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).toHaveBeenCalled();
                expect(connected_accounts.addConnectedAccount).toHaveBeenCalled();
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(3);
                done();
            })
    })

    it("should return 200", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).not.toHaveBeenCalled();
                expect(connected_accounts.addConnectedAccount).not.toHaveBeenCalled();
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(1);
                done();
            })
    })

    it("should return 404 and error=Linked account not found. Create one.", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC1" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Linked account not found. Create one.");
                done();
            })
    })

    it("should return 400 and error=Password is Missing or Invalid.", (done) => {
        request(server).post("/auth/google-callback")
            .send({ g_csrf_token: "ABCD", credential: "ABC1", username: "abc1" })
            .set("Content-Type", "application/json")
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password is Missing or Invalid.");
                done();
            })
    })

    it("should return 200", (done) => {
        request(server).post("/auth/google-callback")
            .send({ username: "abc1", password: "ABCDefgh1.", g_csrf_token: "ABCD", credential: "ABC1" })
            .set('Content-Type', 'application/json')
            .set("Cookie", ["g_csrf_token=ABCD"])
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).not.toHaveBeenCalled();
                expect(connected_accounts.addConnectedAccount).toHaveBeenCalled();
                expect(res.headers.authorization).toBeDefined();
                expect(verifyJWT(res.headers.authorization).userId).toBe(4);
                done();
            })
    })
})

describe("POST /auth/verify", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        request(server).post("/auth/verify")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Captcha Token Missing.");
                done();
            })
    })

    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        request(server).post("/auth/verify")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Captcha Token.");
                done();
            })
    })

    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        request(server).post("/auth/verify")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Email is Invalid.', (done) => {
        request(server).post("/auth/verify")
            .send({ token: "ABCD", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Invalid.");
                done();
            })
    })

    it('should return 400 and message=Already verified', (done) => {
        request(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc2@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Already verified");
                done();
            })
    })

    it('should return 200 but not send email', (done) => {

        request(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc10@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(sendVerificationMail).not.toHaveBeenCalled();
                done();
            })
    })

    it('should return 200 and send email', (done) => {

        request(server).post("/auth/verify")
            .send({ token: "ABCD", email: "abc5@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(sendVerificationMail).toHaveBeenCalled();
                done();
            })
    })
})

describe("GET /auth/verify", () => {
    it('should return 400 and token missing', (done) => {
        request(server).get("/auth/verify")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Token Missing.");
                done();
            })
    })

    it('should return 400 and Invalid Token', (done) => {
        request(server).get("/auth/verify?code=a")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it('should return 400 and Invalid Token', (done) => {
        const code = Buffer.from(createJWT({})).toString("base64url");
        request(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it('should return 400, No error message', (done) => {
        const code = Buffer.from(createJWT({ email: "abc7@gmail.com" })).toString("base64url");
        request(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).toHaveBeenCalled();
                done();
            })
    })

    it('should return 200.', (done) => {
        const code = Buffer.from(createJWT({ email: "abc@gmail.com" })).toString("base64url");
        request(server).get("/auth/verify?code=" + code)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.setEmailVerified).toHaveBeenCalled();
                done();
            })
    })
})

describe("POST /auth/reset-password", () => {
    it('should return 400 and message=Captcha Token Missing.', (done) => {
        request(server).post("/auth/reset-password")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Captcha Token Missing.");
                done();
            })
    })

    it('should return 400 and message=Invalid Captcha Token.', (done) => {
        request(server).post("/auth/reset-password")
            .send({ token: "FAILTHIS" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Captcha Token.");
                done();
            })
    })

    it('should return 400 and message=Email is Missing or Invalid.', (done) => {
        request(server).post("/auth/reset-password")
            .send({ token: "ABCD" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Missing or Invalid.");
                done();
            })
    })

    it('should return 400 and message=Email is Invalid.', (done) => {
        request(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "test@gmail..com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Email is Invalid.");
                done();
            })
    })

    it('should return 200 but not send email', (done) => {

        request(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "abc10@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(sendResetMail).not.toHaveBeenCalled();
                done();
            })
    })

    it('should return 200 and send email', (done) => {

        request(server).post("/auth/reset-password")
            .send({ token: "ABCD", email: "abc5@gmail.com" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(sendResetMail).toHaveBeenCalled();
                done();
            })
    })
})

describe("POST /auth/change-password", () => {
    it('should return 400 and token missing', (done) => {
        request(server).post("/auth/change-password")
            .send({})
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Token Missing.");
                done();
            })
    })

    it('should return 400 and Invalid Token', (done) => {
        request(server).post("/auth/change-password")
            .send({ code: "a" })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it('should return 400 and Invalid Token', (done) => {
        const code = Buffer.from(createJWT({})).toString("base64url");
        request(server).post("/auth/change-password")
            .send({ code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Invalid Token.");
                done();
            })
    })

    it('should return 400 and Password is Missing or Invalid', (done) => {
        const code = Buffer.from(createJWT({ resetId: 10 })).toString("base64url");
        request(server).post("/auth/change-password")
            .send({ code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Password is Missing or Invalid.");
                done();
            })
    })

    it('should return 404 and User not found.', (done) => {
        const code = Buffer.from(createJWT({ resetId: 10 })).toString("base64url");
        request(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("User not found.");
                done();
            })
    })

    it('should return 401 and Token Expired.', (done) => {
        const code = Buffer.from(createJWT({ resetId: 5, iat: Math.floor(Date.now() / 1000) - 600 })).toString("base64url");
        request(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.body.error).toEqual("Token Expired.");
                done();
            })
    })

    it('should return 200.', (done) => {
        const code = Buffer.from(createJWT({ resetId: 5 })).toString("base64url");
        request(server).post("/auth/change-password")
            .send({ password: "HelloTest.12", code })
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(users.changePassword).toHaveBeenCalled();
                done();
            })
    })
})