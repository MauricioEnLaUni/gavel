<script lang="ts">
    import { page } from "$app/stores";
    import { Icon, casa as icon } from "$cmp/icons";
    import * as m from "$lib/paraglide/messages";

    const error = $page.error;

    const status = $page.status || 500;
    const title = error?.message || "Internal Server Error";
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<main
    class="flex h-screen flex-col items-center justify-center bg-neutral font-mono">
    <h1 class="text-9xl font-bold text-primary-content">{status}</h1>
    <h2 class="mt-4 text-2xl text-primary-content">{title}</h2>
    <p class="text-muted-foreground mt-2">{m.an_error_occurred()}</p>
    <a
        class="hover:bg-foreground mt-8 flex gap-x-4 rounded bg-accent px-4 py-2 font-bold"
        href="/">
        <Icon {icon} />
        {m.go_home()}
    </a>
</main>
