import * as m from "$lib/paraglide/messages";
import { error, fail } from "@sveltejs/kit";
import { Access as pg } from "$infra/pg";

export async function load({ url }) {
    const code = String(url.searchParams.get("code"));

    if (code === "") {
        return fail(400,m.malformed_request());
    }
    const pool = await pg.getPool(pg.APP_AUTH);

    try {
        const result = await pool.query(
            "SELECT CASE WHEN EXISTS(SELECT 1 FROM auth.email_authorization WHERE email_authorization_id = $1) THEN CASE WHEN (SELECT created FROM auth.email_authorization WHERE email_authorization_id = $1) <= NOW() - INTERVAL '5 minutes' THEN 2 WHEN (SELECT created FROM auth.email_authorization WHERE email_authorization_id = $1) > NOW() - INTERVAL '5 minutes' THEN 1 END ELSE 0 END AS success LIMIT 1;",
            [code]);
        const { success } = result?.rows[0];
        if (success === 1) {
            await pool.query("UPDATE auth.email_authorization SET used = now() WHERE email_authorization_id = $1", [code]);
            await pool.query("UPDATE auth.user_log");
        }

        return {
            success,
        };
    } catch(e) {
        error(500);
    } finally {
        pool.release();
    }
}
