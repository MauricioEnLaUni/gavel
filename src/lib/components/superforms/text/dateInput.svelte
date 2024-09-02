<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";
    import DateInput from "./simpleDateInput.svelte";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let container: any = {};
    export let etiqueta: any;
    export let input: any;

    export let name: Leaf;
    export let superform: GenT;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<label
    {...container}
    class={cn(
        "input input-bordered flex items-center gap-2 text-xs mt-2 overflow-hidden",
        container?.classes ?? "",
    )}>
    <span class={cn("font-black", etiqueta?.classes ?? "")}>
        {etiqueta.children}
    </span>
    <input
        type="hidden"
        class={"hidden"}
        {name}
        aria-invalid={$errors ? "true" : undefined}
        value={$value}
        {...$constraints} />

    <DateInput bind:value={$value} {...input} id={`${name}-date-input`} />
</label>
{#if $errors}
    <p>{$errors}</p>
{/if}
