<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let container: any = {};
    export let etiqueta: any;
    export let input: any;

    export let name: Leaf;
    export let superform: GenT;

    $: ({ required, readonly, disabled, ...rest } = input);

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<label
    {...container}
    class={cn(
        "input input-bordered flex items-center gap-2",
        container?.classes ?? "",
    )}>
    <span class={cn("font-black", etiqueta?.classes ?? "")}>
        {etiqueta.children}
    </span>
    <input
        type="text"
        id={`${name}-input`}
        {...rest}
        class={cn("min-w-full", rest?.classes ?? "")}
        {name}
        aria-invalid={$errors ? "true" : undefined}
        bind:value={$value}
        {...required === true ? { required: true } : {}}
        {...readonly === true ? { readonly: true } : {}}
        {...disabled === true ? { disabled: true } : {}}
        {...$constraints} />
</label>
{#if $errors}
    <p>{$errors}</p>
{/if}
