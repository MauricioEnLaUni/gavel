import { addMinutes } from "date-fns";
import { error, fail, redirect } from "@sveltejs/kit";
import { Access as pg } from "$infra/pg";
import {
    CODE_TOLERANCE_MINUTES,
    setAuthCookie,
    USER_TYPE,
    type AppSession,
} from "$server/auth";
import { sanitize } from "$def/pages";
import { authErrors, databaseErrors, httpCodes as h } from "$def/errors";
import {
    CREATE_SESSION,
    DISABLE_EMAIL_AUTHORIZATION,
    ENABLE_USER_ACCOUNT,
    GRANT_USER_PERMISSIONS,
    USERNAME_EMAIL_CONFLICT,
} from "$server/queries";

export async function load({ url, cookies, locals }) {
    const code = sanitize(url.searchParams.get("code"), /[^A-z0-9-]/g);

    if (code !== url.searchParams.get("code")) {
        return fail(h.BAD_REQUEST, { id: authErrors.INVALID_CHARACTERS });
    }

    if (code === "") {
        return fail(h.BAD_REQUEST, { id: authErrors.NO_USER_ACTIVATION_CODE });
    }

    const pool = await pg.getPool(pg.APP_AUTH);

    try {
        const result = await pool.query(USERNAME_EMAIL_CONFLICT, [code]);
        if (!result || result.rows.length !== 1) {
            return fail(h.UNAUTHORIZED, {
                id: authErrors.NO_USER_ACTIVATION_CODE,
            });
        } else if (
            addMinutes(result.rows[0].created, CODE_TOLERANCE_MINUTES) <
            new Date()
        ) {
            return fail(h.FORBIDDEN, {
                id: authErrors.EXPIRED_USER_ACTIVATION_CODE,
            });
        }

        const { user_id: userId } = result.rows[0];
        const { ip, userAgent } = locals;
        await pool.query("BEGIN;");

        const [sessionResult] = await Promise.all(
            [
                CREATE_SESSION,
                DISABLE_EMAIL_AUTHORIZATION,
                ENABLE_USER_ACCOUNT,
                GRANT_USER_PERMISSIONS,
            ].map((e, index) => {
                const params = index > 0 ? [userId] : [userId, ip, userAgent];
                return pool.query(e, params);
            }),
        );

        if (!sessionResult || sessionResult.rows?.length !== 1) {
            await pool.query("ROLLBACK;");
            return fail(h.INTERNAL_SERVER_ERROR, {
                id: databaseErrors.GENERIC_FAIL,
            });
        }
        const {
            session_id: sessionId,
            expires,
            created,
            expired,
        } = sessionResult.rows[0];

        const session: AppSession = {
            id: userId,
            category: USER_TYPE.STUDENT,
            session: sessionId,
            expires,
            created,
            expired,
            ip,
            userAgent,
        };
        setAuthCookie(cookies, session);
        await pool.query("COMMIT;");
    } catch (e) {
        console.error(e);
        await pool.query("ROLLBACK;");
        const eId = databaseErrors.GENERIC_FAIL;
        locals.errorId = eId;
        error(h.INTERNAL_SERVER_ERROR, String(eId));
    } finally {
        pool.release();
    }

    throw redirect(h.MOVED_PERMANENTLY, "/");
}

export const actions = {
    default: async () => {},
};
