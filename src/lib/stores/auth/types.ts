export type AppSession = {
    id: string;
    category: number;

    session: string;
    expires: Date;
    created: Date;

    ip: string | undefined | null;
    user_agent: string | undefined | null;
};
