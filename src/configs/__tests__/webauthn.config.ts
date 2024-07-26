import { getRPId, getRPName, getRPOrigin } from "../webauthn.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting relaying party name", () => {
    it("should error if name is undefined", (done)=>{
        delete process.env.RP_NAME;
        expect(getRPName).toThrow("RP Name Not Configured.");
        done();
    })

    it("should error if name is empty", (done)=>{
        process.env.RP_NAME = "";
        expect(getRPName).toThrow("RP Name Not Configured.");
        done();
    })

    it("should work if name exists", (done)=>{
        process.env.RP_NAME = "abcde12345";
        expect(getRPName()).toEqual("abcde12345");
        done();
    })
})

describe("Getting relaying party id", () => {
    it("should error if id is undefined", (done)=>{
        delete process.env.RP_ID;
        expect(getRPId).toThrow("RP Id Not Configured.");
        done();
    })

    it("should error if id is empty", (done)=>{
        process.env.RP_ID = "";
        expect(getRPId).toThrow("RP Id Not Configured.");
        done();
    })

    it("should work if id exists", (done)=>{
        process.env.RP_ID = "abcde12345";
        expect(getRPId()).toEqual("abcde12345");
        done();
    })
})

describe("Getting relaying party origin", () => {
    it("should error if origin is undefined", (done)=>{
        delete process.env.RP_ORIGIN;
        expect(getRPOrigin).toThrow("RP Origin Not Configured.");
        done();
    })

    it("should error if origin is empty", (done)=>{
        process.env.RP_ORIGIN = "";
        expect(getRPOrigin).toThrow("RP Origin Not Configured.");
        done();
    })

    it("should error if origin is invalid", (done)=>{
        process.env.RP_ORIGIN = "abcde12345";
        expect(getRPOrigin).toThrow("Invalid RP Origin");
        done();
    })
    
    it("should error if origin is invalid", (done)=>{
        process.env.RP_ORIGIN = "http://localhost:8080/";
        expect(getRPOrigin).toThrow("Invalid RP Origin");
        done();
    })

    it("should work if origin is valid", (done)=>{
        process.env.RP_ORIGIN = "https://host:4321";
        expect(getRPOrigin()).toEqual(process.env.RP_ORIGIN);
        done();
    })
})