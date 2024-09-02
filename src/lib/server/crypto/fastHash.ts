import { createHash } from "crypto";

export function fastHash(obj: unknown) {
    const hash = createHash("sha1");

    const s = JSON.stringify(obj);
    return hash.update(s).digest("hex");
}

export function verifySha1(hash: string, payload: unknown) {
    return fastHash(payload) === hash;
}
