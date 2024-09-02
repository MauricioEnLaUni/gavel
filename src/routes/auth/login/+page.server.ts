import { PUBLIC_AUTH_COOKIE as authCookie } from "$env/static/public";
import { error, redirect } from "@sveltejs/kit";

import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";
import { Access as pg } from "$infra/pg";
import { encode } from "@msgpack/msgpack";

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

async function hash(password: string) {
    return new Promise((resolve, reject) => {
        const salt = randomBytes(32).toString("hex");

        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);

            resolve(salt + ":" + derivedKey.toString("hex"));
        });
    });
}

async function verify(password: string, hash: string) {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(":");
        const keyBuffer = Buffer.from(key, "hex");
        scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) reject(err);

            resolve(timingSafeEqual(keyBuffer, derivedKey));
        });
    });
}

export const actions = {
    registro: async ({ cookies, request, locals }) => {
        const { usuario, password, pool } = await parseRequest(request);
        const conflictResult = await pool.query(
            "SELECT exists(SELECT 1 FROM informatica.usuario WHERE nombre_usuario = $1);",
            [usuario],
        );
        const conflict = conflictResult.rows[0].exists;

        if (conflict) {
            error(
                409,
                "El usuario solicitado ya existe, intente un usuario diferente",
            );
        }
        const ip = locals.ip;
        const userAgent = locals.userAgent;

        const hashedPassword = await hash(password);
        const payload = Buffer.from(
            encode({
                nombre_usuario: usuario,
                hashed_password: hashedPassword,
                ip,
                user_agent: userAgent,
            }),
        ).toString("base64");
        const result = await pool.query(
            "SELECT * FROM informatica.crear_usuario($1,$2,$3,$4,$5,$6,$7)",
            [hashedPassword, usuario, ip, userAgent, payload, null],
        );
        if (!result.rows[0].clave) {
            error(500, "Hubo un error al crear el usuario");
        }
        const {
            clave: id,
            tipo: tipo,
            sesion,
            expiracion: expira,
            creacion: creado,
        } = result.rows[0];

        cookies.set(
            authCookie,
            Buffer.from(
                encode({
                    id,
                    tipo,
                    sesion,
                    expira,
                    creado,
                    ip,
                    "user-agent": userAgent,
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

        throw redirect(302, "/");
    },
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
