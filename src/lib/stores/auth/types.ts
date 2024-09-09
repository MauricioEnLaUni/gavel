export type AppSession = {
    id: string;
    category: number;

    session: string;
    expires: Date;
    period: {
        created: Date;
        expired: Date | null;
    }

    ip: string | undefined | null;
    userAgent: string | undefined | null;
};
