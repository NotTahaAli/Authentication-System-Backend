"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fs = jest.requireActual("fs");
const rsa_util_1 = require("../rsa.util");
jest.mock('fs');
beforeAll(() => {
    fs_1.existsSync.mockImplementation(fs.existsSync);
    fs_1.mkdirSync.mockImplementation(fs.mkdirSync);
    fs_1.writeFileSync.mockImplementation(fs.writeFileSync);
    fs_1.readFileSync.mockImplementation(fs.readFileSync);
});
describe("Getting Keys", () => {
    it("should make keys folder", () => {
        fs_1.existsSync.mockImplementationOnce(() => false);
        fs_1.mkdirSync.mockImplementationOnce(() => { });
        fs_1.writeFileSync.mockImplementationOnce(() => { });
        fs_1.readFileSync.mockImplementationOnce(() => "ABCD");
        (0, rsa_util_1.getKeys)();
        expect(fs_1.mkdirSync).toHaveBeenCalled();
    });
    it("should generate keys if private_key missing", () => {
        if (fs.existsSync("src/keys") && fs.existsSync("src/keys/private_key.pem"))
            fs.rmSync("src/keys/private_key.pem");
        (0, rsa_util_1.getKeys)();
        expect(fs.existsSync("src/keys/public_key.pem")).toBe(true);
        expect(fs.existsSync("src/keys/private_key.pem")).toBe(true);
    });
    it("should generate keys if public_key missing", () => {
        if (fs.existsSync("src/keys") && fs.existsSync("src/keys/public_key.pem"))
            fs.rmSync("src/keys/public_key.pem");
        (0, rsa_util_1.getKeys)();
        expect(fs.existsSync("src/keys/public_key.pem")).toBe(true);
        expect(fs.existsSync("src/keys/private_key.pem")).toBe(true);
    });
    it("should get keys from file", () => {
        if ((0, fs_1.existsSync)("src/keys") && (0, fs_1.existsSync)("src/keys/public_key.pem"))
            (0, fs_1.rmSync)("src/keys/public_key.pem");
        const res1 = (0, rsa_util_1.getKeys)();
        const res2 = (0, rsa_util_1.getKeys)();
        expect(res2).toEqual(res1);
    });
});
describe("Encryption and Decryption", () => {
    it("should encrypt and decrypt properly", () => {
        const initialData = { name: "HelloWorld" };
        const encrypted = (0, rsa_util_1.encrypt)(initialData);
        const decrypted = (0, rsa_util_1.decrypt)(encrypted);
        expect(initialData).toEqual(decrypted);
    });
});
