import { i18n } from "$lib/i18n";
import { sequence } from "@sveltejs/kit/hooks";

import {
    captureData,
    logRequest,
    redirectLowerCase,
    handleGuardedRoutes,
} from "$server/middleware";

export const handle = sequence(
    redirectLowerCase,
    captureData,
    handleGuardedRoutes,
    i18n.handle(),
    logRequest,
);
