import request from "supertest"
import { Express } from "express";
import { createApp } from "../../utils/createApp.util";
import { linkRoutes } from "../../utils/linkRoutes.util";
import { createJWT } from "../../utils/jwt.util";
jest.mock("../../db/functions/users");
let server: Express;

beforeAll(async () => {
    server = linkRoutes(await createApp());
})

describe("GET /", () => {
    it('should return 200 and success=true', (done) => {
        request(server).get("/")
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body).toMatchObject({ success: true });
                done()
            })
    })
})

describe("POST /", () => {
    it('should return 404 and success=false', (done) => {
        request(server).post("/")
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body.success).toBe(false);
                done()
            })
    })
})

describe("GET /user", ()=>{
    it("should return 401 and error=UnAuthorized", (done)=>{
        request(server).get("/user")
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        })
    })

    it("should return 401 and error=UnAuthorized", (done)=>{
        request(server).get("/user")
        .set("Authorization","ABCDEF")
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        })
    })
    
    it("should return 401 and error=UnAuthorized", (done)=>{
        request(server).get("/user")
        .set("Authorization",createJWT({}, '1m'))
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        })
    })

    it("should return 401 and error=UnAuthorized", (done)=>{
        request(server).get("/user")
        .set("Authorization",createJWT({userId: 1, iat: Math.floor(Date.now() / 1000) - 120}, '10m'))
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        })
    })

    it("should return 401 and error=UnAuthorized", (done)=>{
        request(server).get("/user")
        .set("Authorization",createJWT({userId: 2, iat: Math.floor(Date.now() / 1000) - 120}, '1m'))
        .expect("Content-Type", /json/)
        .expect(401)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.error).toEqual("UnAuthorized");
            done();
        })
    })

    it("should return 200 and user info", (done)=>{
        request(server).get("/user")
        .set("Authorization",createJWT({userId: 1}, '1m'))
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, res) {
            if (err) return done(err);
            expect(res.body.message).toHaveProperty("username");
            expect(res.body.message.username).toEqual("abc");
            done();
        })
    })
})