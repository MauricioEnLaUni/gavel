import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";
import { error, fail, redirect } from "@sveltejs/kit";

import { Access as pg } from "$infra/pg";
import { encode } from "@msgpack/msgpack";
import { verify } from "$server/crypto";

export const actions = {
    login: async ({ cookies, request, locals }) => {
        const data = await request.formData();
        const username = String(data.get("username")).replace(/[^a-zA-Z0-9]/g, "");
        const password = encodeURIComponent(String(data.get("password")));

        const pool = await pg.getPool();

        try {
            const data = await pool.query(
                "SELECT id, type, hash, gen_random_uuid() s FROM auth.active_users WHERE username = $1 LIMIT 1;",
                [username],
            );
            if (data.rows.length !== 1)
                return fail(0x0405);

            const { id, tipo, hash, s: sessionId } = data.rows[0];
            if (!(await verify(password, hash))) {
                return fail(0x0406);
            }
            const { ip, userAgent } = locals;
            const session = {
                id,
                session: sessionId,
                created: new Date(),
                
            };
            const createdSession = await pool.query(
                "INSERT INTO auth.session(user_id,ip,user_agent,hash) VALUES($1,$2,$3,$4);",
                [id, ip, userAgent],
            );
            if (crearSesion.rows.length < 1)
                error(500, "No se ha podido iniciar la sesión");

            const {
                clave_sesion: sesion,
                creado: sesionCreada,
                expira: sesionExpira,
            } = crearSesion.rows[0];

            cookies.set(
                authCookie,
                Buffer.from(
                    encode({
                        id,
                        tipo,
                        sesion,
                        sesionExpira,
                        sesionCreada,
                        "ip": locals.ip,
                        "user-agent": locals.userAgent,
                        adscripcion,
                    }),
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
            error(500, "Ha ocurrido un error");
        } finally {
            pool.release();
        }

        throw redirect(302, "/dash");
    },
};
