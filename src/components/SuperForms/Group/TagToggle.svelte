<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";
    import { cn } from "$lib/utils/cn";

    export let container: any = {};
    export let etiqueta: any;
    export let input: any;

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;

    const { value, constraints } = formFieldProxy(superform, name);
</script>


<label {...container} class={cn("input input-bordered flex items-center gap-2 text-sm w-[128pt]", container?.classes ?? "")}>
    <span {...etiqueta} class={cn("font-bold text-xs text-center w-[64pt]", etiqueta.classes)}>{etiqueta.children}</span>
    <input {...input} {name} class={cn("toggle [--tglbg:black] hover:bg-gray-200 border-stone-750 hover:border-stone-200", input.classes)} type="checkbox" bind:checked={$value} {...$constraints} />
</label>
