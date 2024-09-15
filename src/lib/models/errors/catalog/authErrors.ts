export const authErrors = {
    DISABLED_USER: 0x401 as const,
    NO_USER_ACTIVATION_CODE: 0x402 as const,
    EXPIRED_USER_ACTIVATION_CODE: 0x403 as const,
    USERNAME_NOT_FOUND: 0x404 as const,
    EMAIL_NOT_FOUND: 0x405 as const,
    USERNAME_CONFLICT: 0x406 as const,
    EMAIL_CONFLICT: 0x407 as const,
    NO_AUTH_CACHE: 0x0408 as const,
    INVALID_CHARACTERS: 0x409 as const,
} as const;
