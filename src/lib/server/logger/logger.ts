import { createLogger,transports,format } from "winston";

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

    private static readonly logger = createLogger({
        level: this.LEVELS.DEBUG,
        format: format.combine(
            format.errors({
                stack: true,
            }),
            format.timestamp(),
            format.json(),
        ),
        transports: [
            new transports.Console(),
        ]
    });

    public static info(message: string, payload: string, route: string, method: string, start: string, end: string) {
        const options = {
            payload,
            route,
            method,
            start,
            end
        }
        this.logger.info(message,options);
    }

    public static error(message: string, payload: string, route: string, method: string, start: string, end: string) {
        const options = {
            payload,
            route,
            method,
            start,
            end
        }
        this.logger.error(message,options);
    }
}
