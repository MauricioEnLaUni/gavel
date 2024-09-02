<script lang="ts">
    import Simple from "./simple.svelte";
    import Etiqueta from "./tagInput.svelte";
    import DateInput from "./dateInput.svelte";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    const INPUT_TEXTO = {
        SIMPLE: Simple,
        ETIQUETA: Etiqueta,
        FECHA: DateInput,
    } as const;

    type InputText = keyof typeof INPUT_TEXTO;

    export let variant: InputText;

    export let name: Leaf;
    export let superform: GenT;
</script>

<svelte:component
    this={INPUT_TEXTO[variant]}
    {name}
    {superform}
    {...$$restProps} />
