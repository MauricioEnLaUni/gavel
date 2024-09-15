import type { RequestEvent } from "@sveltejs/kit";

export const beginsWith = (p: string, event: RequestEvent) =>
    event.url.pathname.startsWith(p);
