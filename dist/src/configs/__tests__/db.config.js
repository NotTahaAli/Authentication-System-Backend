"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_config_1 = require("../db.config");
const previousEnv = Object.assign({}, process.env);
afterAll(() => {
    process.env = Object.assign({}, previousEnv);
});
describe("Getting postgres url", () => {
    it("should error if url is undefined", (done) => {
        delete process.env.POSTGRES_URL;
        expect(db_config_1.getPostgresURL).toThrow("Database Credentials Not Configured.");
        done();
    });
    it("should error if url is empty", (done) => {
        process.env.POSTGRES_URL = "";
        expect(db_config_1.getPostgresURL).toThrow("Database Credentials Not Configured.");
        done();
    });
    it("should error if url is invalid", (done) => {
        process.env.POSTGRES_URL = "abcde12345";
        expect(db_config_1.getPostgresURL).toThrow("Invalid Postgres URL");
        done();
    });
    it("should work if url is valid", (done) => {
        process.env.POSTGRES_URL = "postgres://user:password@host:port/database?query=ok&otherQuery=false";
        expect((0, db_config_1.getPostgresURL)()).toEqual(process.env.POSTGRES_URL);
        done();
    });
});
