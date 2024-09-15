import type { AvailableLanguageTag } from "../../lib/paraglide/runtime";
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit";

declare global {
    namespace App {
        interface Error {
            id?: number;
        }
        interface Locals {
            paraglide: ParaglideLocals<AvailableLanguageTag>;

            ip: string | undefined | null;
            userAgent: string | undefined | null;

            requestStart: Date | undefined;
            requestId: string | undefined;
            referer: string | undefined | null;

            formData: string | undefined | null;
            errorId: number | undefined | null;

            session: string | undefined | null;
            userId: string | undefined | null;
        }
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }
}

export {};
