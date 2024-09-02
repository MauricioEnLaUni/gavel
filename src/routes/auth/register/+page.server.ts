import * as m from "$lib/paraglide/messages";

import { PRIVATE_EMAIL_USER as emailUser, PRIVATE_EMAIL_PASSWORD as emailPassword } from "$env/static/private";

import { zod } from "sveltekit-superforms/adapters";
import { Access as pg } from "$infra/pg";

import { superValidate } from "sveltekit-superforms";
import { registerSchema } from "./schema";
import { fail, redirect } from "@sveltejs/kit";
import { hash } from "$server/crypto";
import { encode } from "@msgpack/msgpack";

import { createTransport, type TransportOptions } from "nodemailer";

export async function load() {
    const form = await superValidate(zod(registerSchema));

    return {
        form,
    };
}

export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const username = String(data.get("username"));
        const password = encodeURIComponent(String(data.get("password")));
        const email = String(data.get("email"));

        const pool = await pg.getPool(pg.APP_AUTH);

        try {
            await pool.query("BEGIN;");
            const conflictResult = await pool.query(
                "SELECT exists(SELECT 1 FROM auth.active_users WHERE username = $1);",
                [username],
            );

            if (conflictResult.rows[0].exists) {
                fail(409,m.register_username_conflict());
            }

            const ip = locals.ip;
            const userAgent = locals.userAgent;

            const hashedPassword = await hash(password);
            const payload = Buffer.from(
                encode({
                    username,
                    hashed_password: hashedPassword,
                    ip,
                    ua: userAgent,
                }),
            ).toString("base64");

            const result = await pool.query(
                "SELECT id FROM auth.create_user($1,$2,$3,$4) AS id;",
                [hashedPassword,username,email,payload],
            );
            if (!result.rows[0].clave) {
                fail(500, m.undefined_database_error());
            }
            const { id } = result.rows[0];

            const transport = createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true,
                auth: {
                    user: emailUser,
                    pass: emailPassword,
                }
            } as TransportOptions);

            await transport.sendMail({
                from: "'Admin' <admin@chazaro.click>",
                to: email,
                subject: m.email_confirmation_subject(),
                html: m.email_confirmation_body().replace("ᛟ", id),
            });
            await pool.query("COMMIT;");
        } catch(e) {
            console.error(e);
            await pool.query("ROLLBACK;");
            fail(500, m.undefined_database_error());
        } finally {
            pool.release();
        }

        throw redirect(302, `/auth/verify-account?username=${username}&email=${email}`);
    },
}
