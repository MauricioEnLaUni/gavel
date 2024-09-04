import * as m from "$lib/paraglide/messages";

import { addHours } from "date-fns";
import { error, fail } from "@sveltejs/kit";
import { Access as pg } from "$infra/pg";
import type { AppSession } from "$stores/auth";
import { fastHash } from "$server/crypto";
import { setAuthCookie } from "$server/auth/setCookie";

export async function load({ url, cookies, locals }) {
    const code = String(url.searchParams.get("code"));

    if (code === "") {
        return fail(400,m.malformed_request());
    }
    const pool = await pg.getPool(pg.APP_AUTH);

    try {
        const result = await pool.query(
            "SELECT user_id AS \"user\", gen_random_uuid() AS session FROM auth.email_authorization WHERE email_authorization_id = $1 AND created > NOW() - INTERVAL '10 minutes' LIMIT 1;",
            [code]);
        if (!result) {
            error(0x0402);
        }
        const { user,session } = result.rows[0];
        const { ip, userAgent: ua } = locals;
        const s = {
            id: user,
            session,
            created: new Date(),
            expires: addHours(new Date(), 8),
            ip,
            user_agent: ua,
        } as AppSession;
        const hash = fastHash(s);

        await Promise.all([
            pool.query("UPDATE auth.email_authorization SET used = now() WHERE email_authorization_id = $1;", [code]),
            pool.query("INSERT INTO auth.user_log(user_id,action,data) VALUES($1,'ENABLE',NULL);", [user]),
            pool.query("INSERT INTO auth.session(user_id,ip,user_agent,hash) VALUES((SELECT user_id FROM auth.email_authorization WHERE email_authorization_id = $1),$2,$3,$4);",[code,ip,ua,hash]),
            pool.query("UPDATE auth.user SET type = 'USER' WHERE username = $1;",[user]),
        ]);
        setAuthCookie(cookies,session);

        return {
            success,
        };
    } catch(e) {
        console.error(e);
        error(500);
    } finally {
        pool.release();
    }
}
