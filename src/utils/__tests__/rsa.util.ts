const fs = jest.requireActual("fs");
import { decrypt, encrypt, getKeys } from "../rsa.util";
import keys from "../../db/functions/keys";
jest.mock('../../db/functions/keys')

beforeAll(()=>{
    (keys.setKey as jest.Mock).mockImplementation(jest.fn(async()=>true));
    (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>null));
})

describe("Getting Keys",()=>{

    it("should generate keys if private_key missing", async ()=>{
        (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>{
            if (type == "public") return "ABC";
            return null;
        }));
        await getKeys();
        expect(keys.setKey).toHaveBeenCalledWith("public", expect.anything());
        expect(keys.setKey).toHaveBeenCalledWith("private",expect.anything());
    })
    
    it("should generate keys if public_key missing", async ()=>{
        (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>{
            if (type == "private") return "ABC";
            return null;
        }));
        await getKeys();
        expect(keys.setKey).toHaveBeenCalledWith("public", expect.anything());
        expect(keys.setKey).toHaveBeenCalledWith("private",expect.anything());
    })
    
    it("should get keys from database", async ()=>{
        (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>null));
        const res1 = await getKeys();
        (keys.getKey as jest.Mock).mockImplementation(jest.fn(async(type: string)=>{
            if (type == "public") {
                return {type, key: res1.public_key}
            } else if (type == "private") {
                return {type, key: res1.private_key}
            }
            return null;
        }));
        const res2 = await getKeys();
        expect(res2).toEqual(res1);
    })
})

describe("Encryption and Decryption", ()=>{
    it("should encrypt and decrypt properly", async ()=>{
        const initialData = {name: "HelloWorld"}
        const encrypted = await encrypt(initialData);
        const decrypted = await decrypt<{name: string}>(encrypted);
        expect(initialData).toEqual(decrypted);
    })
})