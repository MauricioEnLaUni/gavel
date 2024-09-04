import { PRIVATE_AUTH_COOKIE as authCookie } from "$env/static/private";

import { encode } from "@msgpack/msgpack";

export function setAuthCookie(cookies: any, session: unknown) {
    cookies.set(
        authCookie,
        Buffer.from(encode(session))
            .toString("base64"),
        {
            maxAge: 2 * 60 * 60,
            httpOnly: true,
            path: "/",
            sameSite: true,
            secure: true,
        },
    );
}
