import { createLogger, transports, format } from "winston";
import { compress } from "$utl/node/zlib";

export class Logger {
    private static readonly LEVELS = {
        ERROR: "error",
        WARNING: "warn",
        INFO: "info",
        HTTP: "http",
        VERBOSE: "verbose",
        DEBUG: "debug",
        SILLY: "silly",
    };

    public static readonly logger = createLogger({
        level: this.LEVELS.DEBUG,
        format: format.combine(
            format.errors({
                stack: true,
            }),
            format.timestamp(),
            format.printf(info => {
                const {
                    auth,
                    sessionId,
                    userId,
                    startTime,
                    endTime,
                    method,
                    searchParams,
                    formData,
                    requestId,
                    lang,
                    status,
                    errorId,
                } = info.message;

                return `${info.timestamp} [${info.level}]: auth:${auth ? "1" : "0"} user:${userId ?? "ᛈ"} session:${sessionId || "ᚨ"} - method:[${method}] - Search:${searchParams} Form:${formData ? compress(formData) : "ᛗ"} Time:${(startTime as Date).toISOString()} - ${(endTime as Date).toISOString()} request:${requestId} lang:${lang} http:${status} error-id:${errorId || "ᛯ"}`;
            }),
        ),
        transports: [new transports.Console()],
    });
}
