import { z } from "zod";
import * as m from "$lib/paraglide/messages";
import { getRequiredMessage as g } from "$utl/zod/zodMessages";

export const registerPageConflict =
    "SELECT username,email FROM auth.user WHERE username = $1 OR email = $2;" as const;
export const registerPageInsert =
    "SELECT id FROM auth.create_user($1,$2,$3,$4) AS id;" as const;

export const registerPageSchema = z.object({
    username: z
        .string(g(m.register_username_required()))
        .min(3, m.register_username_minimum_length())
        .max(16, m.register_username_maximum_length()),
    email: z
        .string(g(m.register_email_required()))
        .max(100, m.register_email_max_length()),
    password: z
        .string(g(m.register_password_required()))
        .length(64, m.register_password_length()),
    repeat: z
        .string(g(m.register_repeat_required()))
        .length(64, m.register_password_length()),
    terms: z
        .boolean(g(m.register_terms_required()))
        .refine(value => value, m.register_terms_required()),
});
