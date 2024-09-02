import { writable } from "svelte/store";

export type AppCache = {
    init: boolean;
    activeUsers: {
        id: Set<string>;
        name: Set<string>;
    };
    activeSessions: Set<string>;
    restrictedUsers: Set<string>;
};

export async function initAuthCache() {

}

export const authCache = writable<AppCache | null>(null);
