import { writable } from "svelte/store";
import type { ApplicationSession } from "$stores/auth/types";

export const appStore = writable<ApplicationSession | null>(null);
