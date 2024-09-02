<script lang="ts" context="module">
    type T = Record<string, unknown>
</script>

<script lang="ts">
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";

    import { Simple, Tag } from "./";

    const INPUT_TEXT = {
        SIMPLE: Simple,
        TAG: Tag,
    } as const;

    type InputText = keyof typeof INPUT_TEXT;
    export let variant: InputText;

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;
</script>

<svelte:component
    this={INPUT_TEXT[variant]}
    {name}
    {superform}
    {...$$restProps} />
