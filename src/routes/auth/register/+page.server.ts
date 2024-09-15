import * as m from "$lib/paraglide/messages";

import { zod } from "sveltekit-superforms/adapters";
import { Access as pg } from "$infra/pg";

import { superValidate } from "sveltekit-superforms";
import { fail, redirect } from "@sveltejs/kit";
import { hash } from "$server/crypto";
import { encode } from "@msgpack/msgpack";

import { EmailTransport as transport } from "$server/services/mailer";
import { getSignUpConfirmationOptions as g } from "$server/services/verificationEmail";
import {
    registerPageSchema as schema,
    registerPageConflict as conflict,
    registerPageInsert as insert,
    sanitizeEmail,
    sanitizeUsername,
} from "$def/pages";
import { authErrors, databaseErrors, httpCodes as h } from "$def/errors";

export async function load() {
    const form = await superValidate(zod(schema));

    const test = (await pg.singleQuery(
        {
            query: "SELECT (period).starting, (period).ending FROM auth.session;",
            params: [],
        },
        pg.authParams,
    )) as any[];
    console.log(test);

    return {
        form,
    };
}

export const actions = {
    default: async ({ request, locals }) => {
        const data = await request.formData();
        const username = sanitizeUsername(data.get("username"));
        const password = encodeURIComponent(String(data.get("password")));
        const email = sanitizeEmail(String(data.get("email")));

        if (email === null || username !== data.get("username")) {
            return fail(h.BAD_REQUEST, { id: authErrors.INVALID_CHARACTERS });
        }

        const pool = await pg.getPool(pg.APP_AUTH);

        try {
            await pool.query("BEGIN;");
            const conflictResult = await pool.query(conflict, [
                username,
                email,
            ]);

            if (conflictResult && conflictResult.rows.length !== 0) {
                const { username: u } = conflictResult.rows[0];
                const result =
                    u === username
                        ? authErrors.USERNAME_CONFLICT
                        : authErrors.EMAIL_CONFLICT;
                locals.errorId = result;
                return fail(h.CONFLICT, { id: result });
            }
            const { ip, userAgent } = locals;

            const hashedPassword = await hash(password);
            const payload = Buffer.from(
                encode({
                    username,
                    hashed_password: hashedPassword,
                    ip,
                    ua: userAgent,
                }),
            ).toString("base64");

            const result = await pool.query(insert, [
                hashedPassword,
                username,
                email,
                payload,
            ]);
            if (!result.rows[0].id) {
                return fail(h.INTERNAL_SERVER_ERROR, {
                    id: databaseErrors.GENERIC_FAIL,
                });
            }
            const { id } = result.rows[0];

            await transport.send(g(email, m.email_confirmation_subject(), id));
            await pool.query("COMMIT;");
        } catch (e) {
            console.error(e);
            await pool.query("ROLLBACK;");
            const id = databaseErrors.GENERIC_FAIL;

            locals.errorId = id;
            return fail(h.INTERNAL_SERVER_ERROR, { id });
        } finally {
            pool.release();
        }

        throw redirect(
            h.PERMANENT_REDIRECT,
            `/auth/verify-account?username=${username}&email=${email}`,
        );
    },
};
