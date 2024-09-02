<script lang="ts">
    import ToggleTag from "./toggleTag.svelte";
    import PillInput from "./pillInput.svelte";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    const GROUP_INPUT = {
        "TOGGLE-TAG": ToggleTag,
        "PILL": PillInput,
    } as const;

    type Variants = keyof typeof GROUP_INPUT;

    export let variant: Variants;

    export let name: Leaf;
    export let superform: GenT;
</script>

<svelte:component
    this={GROUP_INPUT[variant]}
    {name}
    {superform}
    {...$$restProps} />
