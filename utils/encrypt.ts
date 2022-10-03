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
    let cipher = crypto.createCipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString(REPRESENTATION_TYPE), encryptedData: encrypted.toString(REPRESENTATION_TYPE) };
}

export function decrypt(text: EncryptedContent) {
    let iv = Buffer.from(text.iv, REPRESENTATION_TYPE);
    let encryptedText = Buffer.from(text.encryptedData, REPRESENTATION_TYPE);
    let decipher = crypto.createDecipheriv(ENCRYPTION_TYPE, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}