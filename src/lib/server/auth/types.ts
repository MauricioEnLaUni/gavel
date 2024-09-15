export const USER_TYPE = {
    VISTOR: 0 as const,
    STUDENT: 1 as const,
    TEACHER: 2 as const,
    ADMIN_STAFF: 3 as const,
    ADMIN: 4 as const,
} as const;
export type UserType = (typeof USER_TYPE)[keyof typeof USER_TYPE];

export type AppSession = {
    id: string;
    category: UserType;

    session: string;
    expires: Date;
    created: Date;
    expired: Date | null;

    ip: string | undefined | null;
    userAgent: string | undefined | null;
};
