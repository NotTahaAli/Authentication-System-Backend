import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs"
const fs = jest.requireActual("fs");
import { decrypt, encrypt, getKeys } from "../rsa.util";
jest.mock('fs')

beforeAll(()=>{
    (existsSync as jest.Mock).mockImplementation(fs.existsSync);
    (mkdirSync as jest.Mock).mockImplementation(fs.mkdirSync);
    (writeFileSync as jest.Mock).mockImplementation(fs.writeFileSync);
    (readFileSync as jest.Mock).mockImplementation(fs.readFileSync);
})

describe("Getting Keys",()=>{
    it("should make keys folder", ()=>{
        (existsSync as jest.Mock).mockImplementationOnce(()=>false);
        (mkdirSync as jest.Mock).mockImplementationOnce(()=>{});
        (writeFileSync as jest.Mock).mockImplementationOnce(()=>{});
        (writeFileSync as jest.Mock).mockImplementationOnce(()=>{});
        getKeys();
        expect(mkdirSync).toHaveBeenCalled();
    })

    it("should generate keys if private_key missing", ()=>{
        if (fs.existsSync("./keys") && fs.existsSync("./keys/private_key.pem"))
            fs.rmSync("./keys/private_key.pem");
        getKeys();
        expect(fs.existsSync("./keys/public_key.pem")).toBe(true);
        expect(fs.existsSync("./keys/private_key.pem")).toBe(true);
    })
    
    it("should generate keys if public_key missing", ()=>{
        if (fs.existsSync("./keys") && fs.existsSync("./keys/public_key.pem"))
            fs.rmSync("./keys/public_key.pem");
        getKeys();
        expect(fs.existsSync("./keys/public_key.pem")).toBe(true);
        expect(fs.existsSync("./keys/private_key.pem")).toBe(true);
    })
    
    it("should get keys from file", ()=>{
        if (existsSync("./keys") && existsSync("./keys/public_key.pem"))
            rmSync("./keys/public_key.pem");
        const res1 = getKeys();
        const res2 = getKeys();
        expect(res2).toEqual(res1);
    })
})

describe("Encryption and Decryption", ()=>{
    it("should encrypt and decrypt properly", ()=>{
        const initialData = {name: "HelloWorld"}
        const encrypted = encrypt(initialData);
        const decrypted = decrypt<{name: string}>(encrypted);
        expect(initialData).toEqual(decrypted);
    })
})