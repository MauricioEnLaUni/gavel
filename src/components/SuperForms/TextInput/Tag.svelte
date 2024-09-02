<script lang="ts" context="module">
    type T = Record<string, unknown>
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import { formFieldProxy } from "sveltekit-superforms";
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";
    import type { HTMLAttributes, HTMLInputAttributes, HTMLLabelAttributes } from "svelte/elements";

    import { Empty } from "../../utils";

    export let rest: {
        container: HTMLLabelAttributes,
        input: HTMLInputAttributes,
        tag: { node: any, attributes: HTMLAttributes<HTMLElement> },
    } = { container: {}, input: {}, tag: { node: Empty, attributes: {}}};

    const { container, tag, input } = rest;

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<section>
    <label {...container} class={cn("input input-bordered flex items-center gap-2 text-sm" , container?.class ?? "")}>
        <svelte:component this={tag.node} {...tag.attributes} />

        <input
            type="text"
            {...input}
            class={cn("min-w-full", input?.class ?? "")}
            {name}
            {value}
            aria-invalid={$errors ? "true" : undefined}
            {...$constraints} />
    </label>
    {#if $errors}
        <p>{$errors}</p>
    {/if}
</section>
