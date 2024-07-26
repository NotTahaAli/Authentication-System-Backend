import { getJWTSecret } from "../jwt.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting JWT Secret", () => {
    it("should error if secret is undefined", (done)=>{
        delete process.env.JWT_SECRET;
        expect(getJWTSecret).toThrow("JWT Secret Not Configured.");
        done();
    })

    it("should error if secret is empty", (done)=>{
        process.env.JWT_SECRET = "";
        expect(getJWTSecret).toThrow("JWT Secret Not Configured.");
        done();
    })

    it("should error if secret is less than 10 characters", (done)=>{
        process.env.JWT_SECRET = "abcde";
        expect(getJWTSecret).toThrow("JWT Secret must be atleast 10 characters.");
        done();
    })

    it("should work if secret is 10 characters", (done)=>{
        process.env.JWT_SECRET = "abcde12345";
        expect(getJWTSecret()).toEqual("abcde12345");
        done();
    })
})