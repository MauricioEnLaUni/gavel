<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import type { SuperForm, FormPathLeaves } from "sveltekit-superforms";

    import Submit from "./Submit.svelte";

    const FORM_ACTIONS = {
        SUBMIT: Submit,
    } as const;

    type FormAction = keyof typeof FORM_ACTIONS;

    export let variant: FormAction;

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;
</script>

<svelte:component
    this={FORM_ACTIONS[variant]}
    {name}
    {superform}
    {...$$restProps} />
