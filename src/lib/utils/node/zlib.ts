import zlib from "node:zlib";
import { encode } from "@msgpack/msgpack";

export function compress(data: unknown) {
    return zlib
        .gzipSync(Buffer.from(encode(JSON.stringify(data))))
        .toString("base64");
}
