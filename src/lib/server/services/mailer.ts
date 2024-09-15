import {
    createTransport,
    type TransportOptions,
    type SendMailOptions,
} from "nodemailer";

import {
    PRIVATE_EMAIL_USER as user,
    PRIVATE_EMAIL_PASSWORD as pass,
    PRIVATE_EMAIL_HOST as host,
} from "$env/static/private";

export class EmailTransport {
    private static readonly transport = createTransport({
        host,
        port: 465,
        secure: true,
        auth: {
            user,
            pass,
        },
    } as TransportOptions);

    private constructor() {}

    static async send(options: SendMailOptions) {
        await EmailTransport.transport.sendMail(options);
    }
}
