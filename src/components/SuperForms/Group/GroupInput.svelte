<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";

    import TagToggle from "./TagToggle.svelte";

    const GROUP_INPUT = {
        "TOGGLE-ETIQUETA": TagToggle,
    } as const;

    type Variants = keyof typeof GROUP_INPUT;

    export let variant: Variants;

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;
</script>

<svelte:component
    this={GROUP_INPUT[variant]}
    {name}
    {superform}
    {...$$restProps} />
