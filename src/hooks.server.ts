import { i18n } from '$lib/i18n'
import { sequence } from '@sveltejs/kit/hooks'
import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";

import { redirect, type RequestEvent } from "@sveltejs/kit";
import { decode } from "@msgpack/msgpack";
import { Access as pg } from "$infra/pg";
import type { AppSession } from "$lib/stores/auth";

const pathBegins = (
    p: string,
    event: RequestEvent
) => event.url.pathname.startsWith(p);

const validaciones = new Map([[1, ["*"]]]);

async function handleGuardedRoutes({ event, resolve }: { event: any, resolve: any }) {
    const { request } = event;
    const check = (p: string) => pathBegins(p, event);

    const cookie = event.cookies.get(authCookie);

    const whitelist = new Set(["","/"]);
    if (!whitelist.has(event.url.pathname) && (!cookie && !check("/auth"))) {
        throw redirect(302, "/auth/login");
    }

    if (cookie) {
        const parsed = decode(
            Buffer.from(cookie!, "base64"),
        ) as AppSession;
        const { id, category, session, expires, ip } = parsed;
        const userAgent = parsed.user_agent;

        const sessionSearch = (await pg.singleQuery({
            query: "SELECT exists(SELECT 1 FROM auth.session s JOIN auth.active_users a ON s.user_id = a.id WHERE s.user_id = $1 AND s.session_id = $2 AND a.username IS NOT NULL) e;",
            params: [id, session]},{
            ...pg.baseParams,
            process: ({ rows }) => (rows as { e: boolean }[])[0].e
        })) as boolean;
        const grants = validaciones.get(category);
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

    event.locals.ip = event.getClientAddress();
    event.locals.userAgent = request.headers.get("user-agent");
    return await resolve(event);
}

export const handle = sequence(handleGuardedRoutes,i18n.handle());
