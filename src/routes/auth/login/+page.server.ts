import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";
import { error, redirect } from "@sveltejs/kit";

import { Access as pg } from "$infra/pg";
import { encode } from "@msgpack/msgpack";
import { verify } from "$server/crypto/index";

async function parseRequest(request: Request) {
    const data = await request.formData();
    const usuario = String(data.get("usuario")).replace(/[^a-zA-Z0-9]/g, "");
    const password = encodeURIComponent(String(data.get("password")));

    const pool = await pg.getPool();
    return {
        usuario,
        password,
        pool,
    };
}

export const actions = {
    login: async ({ cookies, request, locals }) => {
        const { usuario, password, pool } = await parseRequest(request);

        try {
            const data = await pool.query(
                "SELECT id, tipo, hash, unidad FROM informatica.usuarios_activos WHERE usuario = $1;",
                [usuario],
            );
            if (data.rows.length < 1)
                error(404, "No se ha encontrado el usuario");

            const { id, tipo, hash, unidad: adscripcion } = data.rows[0];
            if (!(await verify(password, hash))) {
                error(400, "Password incorrecto");
            }
            const { ip, userAgent } = locals;
            const crearSesion = await pool.query(
                "INSERT INTO informatica.sesion(clave_usuario,ip,user_agent) VALUES($1,$2,$3) RETURNING *;",
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
