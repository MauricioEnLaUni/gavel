import { randomBytes, scrypt } from "node:crypto";

export async function hash(password: string) {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(32).toString("hex");

        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);

            resolve(salt + ":" + derivedKey.toString("hex"));
        });
    });
}
