export const SUPER_FIELDS = {
    "TEXT-INPUT": "TEXT-INPUT",
    "SELECT": "SELECT",
    "GROUP-INPUT": "GROUP-INPUT",
    "AUTOCOMPLETE": "AUTOCOMPLETE",
    "ACTIONS": "ACTIONS",
} as const;

export type CatalogoCampos = (typeof SUPER_FIELDS)[keyof typeof SUPER_FIELDS];
