import * as crypto from "crypto";

const key = process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY : "";
if (!key) {
    throw new Error("Encryption key not found.");
}

const ENCRYPTION_TYPE = 'aes-256-cbc';
const REPRESENTATION_TYPE = 'hex';

type EncryptedContent = {
    iv: string,
    encryptedData: string
}

export function encrypt(text: any) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString(REPRESENTATION_TYPE), encryptedData: encrypted.toString(REPRESENTATION_TYPE) };
}


export function encryptWithKey(text: any, key: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString(REPRESENTATION_TYPE), encryptedData: encrypted.toString(REPRESENTATION_TYPE) };
}

function pkEncryptionKey(userId: string, tokenName: string, network: string, address: string) {
    const addressMD5: string = crypto.createHash('md5').update(address).digest('hex');
    const keyMD5: string = crypto.createHash('md5').update(userId + tokenName + network + addressMD5).digest('hex');
    return keyMD5;
}

export function encryptPK(userId: string, tokenName: string, network: string, address: string, privateKey: string) {
    return encryptWithKey(privateKey, pkEncryptionKey(userId, tokenName, network, address));
}


export function decryptPK(userId: string, tokenName: string, network: string, address: string, privateKey: string) {
    return decryptWithKey(concatenatedToIVPair(privateKey), pkEncryptionKey(userId, tokenName, network, address));
}

export function decrypt(text: EncryptedContent) {
    const iv = Buffer.from(text.iv, REPRESENTATION_TYPE);
    const encryptedText = Buffer.from(text.encryptedData, REPRESENTATION_TYPE);
    const decipher = crypto.createDecipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


export function decryptWithKey(text: EncryptedContent, key: string) {
    const iv = Buffer.from(text.iv, REPRESENTATION_TYPE);
    const encryptedText = Buffer.from(text.encryptedData, REPRESENTATION_TYPE);
    const decipher = crypto.createDecipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export function concatenatedToIVPair(concatenatedString: string) {
    if (concatenatedString.length !== 192) {
        throw new Error("Decryption - Invalid IV Pair, length is not correct.")
    }

    const iv = concatenatedString.substring(0, 32);
    const encryptedData = concatenatedString.substring(32, 192);
    return {
        iv,
        encryptedData
    }
}

export function decryptIVPair(concatenatedString: string) {
    return decrypt(concatenatedToIVPair(concatenatedString));
}
