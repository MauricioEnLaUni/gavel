import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";

import { type Handle, redirect } from "@sveltejs/kit";
import { beginsWith } from "$utl/path";
import { decode } from "@msgpack/msgpack";
import type { AppSession } from "$server/auth";
import { Access as pg } from "$infra/pg";

// TODO: Grant checking
const validations = new Map([[1, ["*"]]]);

export const handleGuardedRoutes: Handle = async ({ event, resolve }) => {
    const { request } = event;
    const check = (p: string) => beginsWith(p, event);

    const cookie = event.cookies.get(authCookie);

    const whitelist = new Set(["", "/"]);
    if (!whitelist.has(event.url.pathname) && !cookie && !check("/auth")) {
        throw redirect(302, "/auth/login");
    }

    if (cookie) {
        const parsed = decode(Buffer.from(cookie!, "base64")) as AppSession;
        const { id, category, session, expires, ip } = parsed;
        const userAgent = String(parsed.userAgent);

        const sessionSearch = (await pg.singleQuery(
            {
                query: "SELECT exists(SELECT 1 FROM auth.session s JOIN auth.active_users a ON s.user_id = a.id WHERE s.user_id = $1 AND s.session_id = $2 AND a.username IS NOT NULL) e;",
                params: [id, session],
            },
            {
                ...pg.baseParams,
                process: ({ rows }) => (rows as { e: boolean }[])[0].e,
            },
        )) as boolean;
        const grants = validations.get(category);
        if (
            !sessionSearch ||
            expires < new Date() ||
            ip !== event.getClientAddress() ||
            userAgent !== request.headers.get("user-agent") ||
            grants === undefined
        ) {
            event.cookies.set(authCookie, "", {
                path: "/",
                expires: new Date(Date.now() - 3600),
            });
        }
    }

    return resolve(event);
};
