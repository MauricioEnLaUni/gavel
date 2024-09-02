<script lang="ts">
    import { cn } from "$lib/utils/cn";
    import { formFieldProxy } from "sveltekit-superforms";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let name: Leaf;
    export let superform: GenT;

    const { constraints } = formFieldProxy(superform, name);
</script>

<div
    {...$$restProps.container}
    class={cn("", $$restProps.container?.classes ?? "")}>
    <input
        {name}
        type="submit"
        class={cn(
            "btn btn-outline btn-primary",
            $$restProps.input?.classes ?? "",
        )}
        {...$constraints}
        {...$$restProps.input} />
</div>
