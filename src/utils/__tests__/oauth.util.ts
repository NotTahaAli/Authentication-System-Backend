import { verify } from "../oauth.util"

describe("OAuth Call",()=>{
    it("should error if invalid JWT",async()=>{
        await expect(verify("ABCD")).rejects.toThrow("Wrong number of segments in token: ABCD");
    })
})