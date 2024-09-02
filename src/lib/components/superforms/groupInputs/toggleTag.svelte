<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";
    import type { Leaf,GenT } from "$cmp/superforms/types";

    export let container: any = {};
    export let etiqueta: any;
    export let input: any;

    export let name: Leaf;
    export let superform: GenT;

    const { value, constraints } = formFieldProxy(superform, name);
</script>

<label
    {...container}
    class={cn(
        "input input-bordered flex w-[128pt] items-center gap-2 text-sm",
        container?.classes ?? "",
    )}>
    <span
        {...etiqueta}
        class={cn(
            "w-[64pt] text-center text-xs font-bold",
            etiqueta.classes ?? "",
        )}>{etiqueta.children}</span>
    <input
        {...input}
        id={`${name}-toggle`}
        {name}
        class={cn(
            "border-stone-750 toggle [--tglbg:black] hover:border-stone-200 hover:bg-gray-200",
            input.classes ?? "",
        )}
        type="checkbox"
        bind:checked={$value}
        {...$constraints} />
</label>
