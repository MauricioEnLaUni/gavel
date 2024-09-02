<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let container: any;
    export let input: any;

    export let name: Leaf;
    export let superform: GenT;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<div
    {...container ?? {}}
    class={cn(
        "control input input-bordered flex items-center gap-2",
        container?.classes ?? "",
    )}>
    <slot name="before" />
    <input
        {...input}
        class={cn("min-w-full", input.classes)}
        {name}
        aria-invalid={$errors ? "true" : undefined}
        bind:value={$value}
        {...$constraints}
        {...$$restProps} />
    <slot name="after" />
</div>
