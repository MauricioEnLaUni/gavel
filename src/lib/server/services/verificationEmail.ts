import * as m from "$lib/paraglide/messages";

import { PRIVATE_EMAIL_USER as emailUser } from "$env/static/private";

const email = `<main style="margin:0;padding:0;font-family:Arial,sans-serif;background-color:#f4f4f9"><div style="max-width:600px;margin:20px auto;background-color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.1);border-radius:8px;overflow:hidden"><div style="padding:24px"><div style="text-align:center;margin-bottom:16px"><img src="https://chazaro.click/assets/logo.avif" alt="$0" style="width:64px;height:64px;border-radius:4px"></div><h1 style="font-size:24px;font-weight:700;text-align:center;color:#333;margin:0">$1</h1><h2 style="font-size:20px;font-weight:600;text-align:center;color:#555;margin:16px 0 0 0">$2</h2><div style="color:#555;text-align:justify;line-height:1.5;margin-top:16px"><p>$3</p><p>$4</p></div><div style="text-align:center;margin-top:16px"><p style="margin:0;font-size:14px;color:#777">$5</p><a href="https://chazaro.click/auth/account-verification?code=$9" style="color:#007bff;text-decoration:underline;word-break:break-all">https://chazaro.click/auth/account-verification?code=$9</a></div><div style="text-align:center;margin-top:16px"><a href="https://chazaro.click/auth/account-verification?code=$9" style="display:inline-block;padding:12px 24px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:4px;font-weight:700">$6</a></div></div><div style="background-color:#eee;padding:16px;text-align:center"><p style="font-size:12px;color:#555;margin:0">$7<a href="mailto:$8" style="color:#007bff;text-decoration:none">$8</a></p></div></div></main>`;
const strings = [
    m.email_confirmation_body_logo_alt(),
    m.email_confirmation_body_title(),
    m.email_confirmation_body_subtitle(),
    m.email_confirmation_body_first_paragraph(),
    m.email_confirmation_body_second_paragraph(),
    m.email_confirmation_body_cta_paragraph(),
    m.email_confirmation_body_cta_button(),
    m.email_confirmation_body_footer_text(),
];

export function getSignUpConfirmationOptions(
    to: string,
    subject: string,
    token: string,
) {
    if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(subject)) {
        throw new Error("0xFFF0FF");
    }
    let temp = email;
    [...strings,emailUser,token].forEach(
        (current, index) => (temp = temp.replaceAll(`$${index}`, current)),
    );

    return {
        from: `"Admin" <${emailUser}>`,
        to,
        subject,
        html: temp,
    };
}
