import type { Handle } from "@sveltejs/kit";
import { randomUUID } from "node:crypto";

export const captureData: Handle = ({ event, resolve }) => {
    const { headers } = event.request;

    event.locals.ip = event.getClientAddress();
    event.locals.userAgent = headers.get("user-agent");

    event.locals.requestStart = new Date();
    event.locals.requestId = randomUUID();
    event.locals.referer = headers.get("referer");

    return resolve(event);
};
