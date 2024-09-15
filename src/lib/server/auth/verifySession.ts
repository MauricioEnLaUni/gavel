import { get } from "svelte/store";

import { decode } from "@msgpack/msgpack";

import type { AppSession } from "$server/auth";
import { fastHash } from "$server/crypto";
import { type AppCache, authCache } from "$server/cache";
import { Access as pg } from "$infra/pg";

export async function verifySession(cookie: string) {
    const session = decode(Buffer.from(cookie, "base64")) as AppSession;
    const cache = get(authCache) as AppCache | null;
    if (!cache) return 0x0201;

    const { activeUsers, activeSessions } = cache;
    const hashed = fastHash(session);

    const expires = new Date(session.expires);
    const created = new Date(session.created);

    if (!activeUsers.id.has(session.id)) return 0x0304;

    if (
        !activeSessions.has(hashed) ||
        expires < new Date() ||
        expires.getTime() - created.getTime() > 8 * 60 * 60 * 1000
    )
        return 0x0301;

    const { id, session: sessionId } = session;

    const searchResults = (await pg.singleQuery(
        {
            query: "SELECT exists(SELECT 1 FROM auth.session s JOIN auth.active_users a ON s.user_id = a.id WHERE s.user_id = $1 AND s.session_id = $2 AND a.username IS NOT NULL) e;",
            params: [id, sessionId],
        },
        {
            ...pg.baseParams,
            process: ({ rows }) => (rows as { e: boolean }[])[0].e,
        },
    )) as boolean;

    return searchResults ? 0x1001 : 0x0401;
}
