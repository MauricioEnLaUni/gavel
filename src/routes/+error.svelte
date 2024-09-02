<script lang="ts">
    import { page } from "$app/stores";
    import { Icon, casa as icon } from "$cmp/icons";

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
    <p class="text-muted-foreground mt-2">Ha ocurrido un error</p>
    <a
        class="mt-8 bg-accent hover:bg-foreground font-bold py-2 px-4 rounded flex gap-x-4"
        href="/">
        <Icon {icon} />
        Regresar a Inicio
    </a>
</main>
