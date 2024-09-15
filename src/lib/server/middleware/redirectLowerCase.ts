import type { Handle } from "@sveltejs/kit";

export const redirectLowerCase: Handle = async ({ event, resolve }) => {
    const { url } = event;
    const newPath = url.pathname.toLowerCase();

    if (url.pathname !== newPath) {
        return new Response(null, {
            status: 301,
            headers: {
                location: `${url.origin}${newPath}${url.search}`,
            },
        });
    }

    return resolve(event);
};
