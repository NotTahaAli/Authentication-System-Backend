import NodeRSA from "node-rsa"
import keys from "../db/functions/keys";

function generateKeys() {
    const key = new NodeRSA({ b: 512 });
    return { public_key: key.exportKey('pkcs8-public-pem'), private_key: key.exportKey('pkcs1-pem') }
}

export async function getKeys() {
    let public_key = await keys.getKey("public");
    let private_key = public_key ? await keys.getKey("private") : null;
    if (!public_key || !private_key) {
        const { public_key, private_key } = generateKeys();
        await keys.setKey("public", public_key);
        await keys.setKey("private", private_key);
        return { public_key, private_key };
    }
    return { public_key: public_key.key, private_key: private_key.key }
}

export async function encrypt(data: Record<string | number, any>) {
    const key = new NodeRSA();
    key.importKey((await getKeys()).public_key, 'pkcs8-public-pem');
    const encrypted = key.encrypt(JSON.stringify(data), 'base64');
    return encrypted;
}

export async function decrypt<T = Record<string | number, any>>(encryptedData: string): Promise<T> {
    const key = new NodeRSA();
    key.importKey((await getKeys()).private_key, 'pkcs1-pem');
    const decryptedString = key.decrypt(encryptedData, 'utf8');
    const decrypedObject = JSON.parse(decryptedString);
    return decrypedObject;
}