import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";
import { COOKIE_LIFETIME_MS as maxAge } from "$server/auth";

import { encode } from "@msgpack/msgpack";

export function setAuthCookie(cookies: any, session: unknown) {
    cookies.set(authCookie, Buffer.from(encode(session)).toString("base64"), {
        maxAge,
        httpOnly: true,
        path: "/",
        sameSite: true,
        secure: true,
    });
}
