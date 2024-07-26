import { getPostgresURL } from "../db.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting postgres url", () => {
    it("should error if url is undefined", (done)=>{
        delete process.env.POSTGRES_URL;
        expect(getPostgresURL).toThrow("Database Credentials Not Configured.");
        done();
    })

    it("should error if url is empty", (done)=>{
        process.env.POSTGRES_URL = "";
        expect(getPostgresURL).toThrow("Database Credentials Not Configured.");
        done();
    })

    it("should error if url is invalid", (done)=>{
        process.env.POSTGRES_URL = "abcde12345";
        expect(getPostgresURL).toThrow("Invalid Postgres URL");
        done();
    })

    it("should work if url is valid", (done)=>{
        process.env.POSTGRES_URL = "postgres://user:password@host:port/database?query=ok&otherQuery=false";
        expect(getPostgresURL()).toEqual(process.env.POSTGRES_URL);
        done();
    })
})