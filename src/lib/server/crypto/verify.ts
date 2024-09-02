import { scrypt, timingSafeEqual } from "node:crypto";

export async function verify(password: string, hash: string) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":");
        const keyBuffer = Buffer.from(key, "hex");
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);

            resolve(timingSafeEqual(keyBuffer, derivedKey));
        });
    });
}
