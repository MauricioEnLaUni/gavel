<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import {
        formFieldProxy,
        type FormPathLeaves,
        type SuperForm,
    } from "sveltekit-superforms";
    import type { HTMLOptionAttributes } from "svelte/elements";

    export let opciones: { option: HTMLOptionAttributes, children: HTMLElement }[] = [];

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<select
    {name}
    class="select select-bordered w-full max-w-xs"
    aria-invalid={$errors ? "true" : undefined}
    {...$constraints}
    {...$$restProps}
    bind:value={$value}>
    {#each opciones as { option, children }}
        <option {...option}>{children}</option>
    {/each}
</select>
