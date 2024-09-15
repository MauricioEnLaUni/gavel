import { writable } from "svelte/store";
import type { AppSession } from "$server/auth";

export const appStore = writable<AppSession | null>(null);
