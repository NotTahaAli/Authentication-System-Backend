"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = getKeys;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const fs_1 = require("fs");
const node_rsa_1 = __importDefault(require("node-rsa"));
function generateKeys() {
    const key = new node_rsa_1.default({ b: 512 });
    return { public_key: key.exportKey('pkcs8-public-pem'), private_key: key.exportKey('pkcs1-pem') };
}
function getKeys() {
    if (!(0, fs_1.existsSync)('src/keys')) {
        (0, fs_1.mkdirSync)("src/keys");
    }
    if (!(0, fs_1.existsSync)('src/keys/public_key.pem') || !(0, fs_1.existsSync)('src/keys/private_key.pem')) {
        const { public_key, private_key } = generateKeys();
        (0, fs_1.writeFileSync)("src/keys/public_key.pem", public_key);
        (0, fs_1.writeFileSync)("src/keys/private_key.pem", private_key);
        return { public_key, private_key };
    }
    const public_key = (0, fs_1.readFileSync)("src/keys/public_key.pem");
    const private_key = (0, fs_1.readFileSync)("src/keys/private_key.pem");
    return { public_key, private_key };
}
function encrypt(data) {
    const key = new node_rsa_1.default();
    key.importKey(getKeys().public_key, 'pkcs8-public-pem');
    const encrypted = key.encrypt(JSON.stringify(data), 'base64');
    return encrypted;
}
function decrypt(encryptedData) {
    const key = new node_rsa_1.default();
    key.importKey(getKeys().private_key, 'pkcs1-pem');
    const decryptedString = key.decrypt(encryptedData, 'utf8');
    const decrypedObject = JSON.parse(decryptedString);
    return decrypedObject;
}
