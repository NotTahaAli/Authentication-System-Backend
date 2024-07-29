import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import NodeRSA from "node-rsa"

function generateKeys() {
    const key = new NodeRSA({ b: 512 });
    return { public_key: key.exportKey('pkcs8-public-pem'), private_key: key.exportKey('pkcs1-pem') }
}

export function getKeys() {
    if (!existsSync('/keys')) {
        mkdirSync("/keys")
    }
    if (!existsSync('/keys/public_key.pem') || !existsSync('/keys/private_key.pem')) {
        const { public_key, private_key } = generateKeys();
        writeFileSync("/keys/public_key.pem", public_key, "ascii");
        writeFileSync("/keys/private_key.pem", private_key, "ascii");
        return { public_key, private_key };
    }
    const public_key = readFileSync("/keys/public_key.pem", "ascii")
    const private_key = readFileSync("/keys/private_key.pem", "ascii")
    return { public_key, private_key }
}

export function encrypt(data: Record<string | number, any>) {
    const key = new NodeRSA();
    key.importKey(getKeys().public_key, 'pkcs8-public-pem');
    const encrypted = key.encrypt(JSON.stringify(data), 'base64');
    return encrypted;
}

export function decrypt<T = Record<string | number, any>>(encryptedData: string): T {
    const key = new NodeRSA();
    key.importKey(getKeys().private_key, 'pkcs1-pem');
    const decryptedString = key.decrypt(encryptedData, 'utf8');
    const decrypedObject = JSON.parse(decryptedString);
    return decrypedObject;
}