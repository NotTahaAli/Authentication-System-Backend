import { getOAuthID } from "../oauth.config";

const previousEnv = { ...process.env };

afterAll(() => {
    process.env = { ...previousEnv };
})

describe("Getting oAuth ID", () => {
    it("should error if id is undefined", (done)=>{
        delete process.env.OAUTH_CLIENT_ID;
        expect(getOAuthID).toThrow("oAuth Client ID Not Configured.");
        done();
    })

    it("should error if id is empty", (done)=>{
        process.env.OAUTH_CLIENT_ID = "";
        expect(getOAuthID).toThrow("oAuth Client ID Not Configured.");
        done();
    })

    it("should work if id exists", (done)=>{
        process.env.OAUTH_CLIENT_ID = "abcde12345";
        expect(getOAuthID()).toEqual("abcde12345");
        done();
    })
})