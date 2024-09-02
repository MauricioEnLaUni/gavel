import type { FormPathLeaves, SuperForm } from "sveltekit-superforms";

export const SUPER_FIELDS = {
    "TEXT-INPUT": "TEXT-INPUT",
    "SELECT": "SELECT",
    "GROUP-INPUT": "GROUP-INPUT",
    "AUTOCOMPLETE": "AUTOCOMPLETE",
    "ACTIONS": "ACTIONS",
} as const;

export type GenT = SuperForm<Record<string, unknown>>;
export type Leaf = FormPathLeaves<Record<string, unknown>>;

export type FormFieldCatalog = (typeof SUPER_FIELDS)[keyof typeof SUPER_FIELDS];
