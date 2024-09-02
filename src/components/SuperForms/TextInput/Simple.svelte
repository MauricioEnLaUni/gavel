<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import { formFieldProxy } from "sveltekit-superforms";
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";

    export let rest: {
        container: any,
        input: any,
    } = { container: {}, input: {} };

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<div {...rest.container ?? {}} class={cn("control input input-bordered flex items-center gap-2", rest.container?.classes ?? "")}>
    <slot name="before" />
    <input
        {...rest.input}
        class={cn("min-w-full", rest.input.classes)}
        {name}
        aria-invalid={$errors ? "true" : undefined}
        bind:value={$value}
        {...$constraints}
        {...$$restProps} />
    <slot name="after" />
</div>
