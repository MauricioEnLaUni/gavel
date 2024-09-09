import { addMinutes } from "date-fns";
import { error, fail } from "@sveltejs/kit";
import { Access as pg } from "$infra/pg";
import type { AppSession } from "$stores/auth";
import { fastHash } from "$server/crypto";
import { setAuthCookie } from "$server/auth/setCookie";

export async function load({ url, cookies, locals }) {
    const code = String(url.searchParams.get("code"));

    if (code === "") {
        return fail(0x0300);
    }
    const pool = await pg.getPool(pg.APP_AUTH);

    try {
        console.log(`Requesting user login check start: ${new Date().toString()}`);
        const result = await pool.query(
            "SELECT user_id,created FROM auth.email_authorization WHERE used IS NULL AND email_authorization_id = $1 LIMIT 1;",
            [code]);
        if (!result || result.rows.length !== 1) {
            return fail(0x0402);
        } else if (addMinutes(result.rows[0].created, 12) < new Date()) {
            return fail(0x0407);
        }

        const { user_id: userId } = result.rows[0];
        const { ip,userAgent } = locals;
        await pool.query("BEGIN;");

        const [sessionResult] = await Promise.all([
            pool.query("INSERT INTO auth.session(user_id,ip,user_agent,hash) VALUES($1,$2,$3) RETURNING session_id, expires, period;",[userId,ip,userAgent]),
            pool.query("UPDATE auth.email_authorization SET used = now() WHERE email_authorization_id = $1;", [code]),
            pool.query("INSERT INTO auth.user_log(user_id,action,data) VALUES($1,'ENABLE',NULL);", [userId]),
            pool.query("UPDATE auth.user SET type = 'USER' WHERE username = $1;",[userId])]);

        if (!sessionResult || sessionResult.rows?.length !== 1) {
            await pool.query("ROLLBACK;");
            return fail(0x0102);
        }
        const { session_id:sessionId,expires,period } = sessionResult.rows[0];
        // TODO: Replace by a real logging
        console.log(`Enabling user start: ${new Date().toString()}`);
        const session: AppSession = {
            id: userId,
            category: 1,
            session:sessionId,
            expires,
            period: {
                created: period.created,
                expired: period.expired,
            },
            ip,
            userAgent,
        };
        await pool.query(
            "INSERT INTO auth.session_hash(session_id,hash) VALUES($1,$2);",
            [sessionId,fastHash(session)]);
        setAuthCookie(cookies,session);

        return {
            status: 200,
            code: 0x0408,
        };
    } catch(e) {
        console.error(e);
        error(0x0F01);
    } finally {
        pool.release();
    }
}

export const actions = {
    default: async () => {

    }
}
