import type { Handle } from "@sveltejs/kit";
import { Logger } from "$server/logger";

export const logRequest: Handle = async ({ event, resolve }) => {
    const {
        userId,
        requestId,
        requestStart: startTime,
        session: sessionId,
        formData,
        errorId,
    } = event.locals;
    const { method, headers } = event.request;

    const endTime = new Date();

    const response = await resolve(event);
    const { status } = response;

    Logger.logger.info({
        auth: userId && sessionId,
        sessionId,
        userId,
        method,
        startTime,
        endTime,
        searchParams: event.url.search,
        formData,
        requestId,
        lang: headers.get("accept-language"),
        status,
        errorId,
    });

    return response;
};
