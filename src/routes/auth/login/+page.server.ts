import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";
import { error, fail, redirect } from "@sveltejs/kit";

import { Access as pg } from "$infra/pg";
import { encode } from "@msgpack/msgpack";
import { fastHash, verify } from "$server/crypto";
import type { AppSession } from "$stores/auth";

export const actions = {
    login: async ({ cookies, request, locals }) => {
        const data = await request.formData();
        const username = String(data.get("username")).replace(/[^a-zA-Z0-9]/g, "");
        const password = encodeURIComponent(String(data.get("password")));

        const pool = await pg.getPool();

        try {
            const data = await pool.query(
                "SELECT id, type, hash FROM auth.active_users WHERE username = $1 LIMIT 1;",
                [username]);

            if (data.rows.length !== 1) {
                return fail(0x0405);
            }

            const { id, type: category, hash } = data.rows[0];
            if (!(await verify(password, hash))) {
                return fail(0x0406);
            }
            const { ip, userAgent } = locals;
            const createdSession = await pool.query(
                "INSERT INTO auth.session(user_id,ip,user_agent) VALUES($1,$2,$3) RETURNING session_id s, expires, period;",
                [id, ip, userAgent]);
            if (createdSession.rows.length < 1) {
                return fail(0x0102);
            }

            const {
                s: session,
                period,
                expires,
            } = createdSession.rows[0];
            const sessionData: AppSession = {
                id,
                category,
                session,
                expires,
                period: {
                    created: period.created,
                    expired: period.expired,
                },
                ip,
                userAgent,
            };
            const hashedSession = fastHash(session);
            await pool.query(
                "INSERT INTO auth.session_hash(session_id,hash) VALUES($1,$2);",
                [session,hashedSession]);

            cookies.set(
                authCookie,
                Buffer.from(
                    encode(sessionData),
                ).toString("base64"),
                {
                    maxAge: 2 * 60 * 60,
                    httpOnly: true,
                    path: "/",
                    sameSite: true,
                    secure: true,
                },
            );
        } catch (e) {
            console.error(e);
            error(0x0F01);
        } finally {
            pool.release();
        }

        throw redirect(302, "/main");
    },
};
