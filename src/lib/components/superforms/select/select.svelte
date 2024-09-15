<script lang="ts">
    import SimpleSelect from "./simpleSelect.svelte";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    const SELECTS = {
        SIMPLE: SimpleSelect,
    } as const;

    type SelectSeleccion = keyof typeof SELECTS;

    export let variant: SelectSeleccion;

    export let name: Leaf;
    export let superform: GenT;
</script>

<svelte:component this={SELECTS[variant]} {name} {superform} {...$$restProps} />
