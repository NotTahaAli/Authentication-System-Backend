import request from "supertest"
import { Express } from "express";
import { createApp } from "../../utils/createApp.util";
import { linkRoutes } from "../../utils/linkRoutes.util";
let server: Express;

beforeAll(async () => {
    server = await createApp();
    server.get("/customErrorPage", ()=>{
        throw {status: 400, message: "Hello"}
    })
    server.get("/defaultErrorPage", ()=>{
        throw {}
    })
    linkRoutes(server);
})

describe("GET /customErrorPage", () => {
    it('should return 400 and error="Hello"', (done) => {
        request(server).get("/customErrorPage")
            .expect('Content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body.error).toEqual("Hello");
                expect(res.body.success).toBe(false);
                done()
            })
    })
})

describe("GET /defaultErrorPage", () => {
    it('should return 500 and error=undefined', (done) => {
        request(server).get("/defaultErrorPage")
            .expect('Content-Type', /json/)
            .expect(500)
            .end(function (err, res) {
                if (err) return done(err)
                expect(res.body.error).toBeUndefined();
                expect(res.body.success).toBe(false);
                done()
            })
    })
})