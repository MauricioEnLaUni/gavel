<script lang="ts">
    import SubmitButton from "./submitButton.svelte";
    import SearchButton from "./searchButton.svelte";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    const FORM_ACTIONS = {
        SUBMIT: SubmitButton,
        SEARCH: SearchButton,
    } as const;

    type FormAction = keyof typeof FORM_ACTIONS;

    export let variant: FormAction;

    export let name: Leaf;
    export let superform: GenT;
</script>

<svelte:component
    this={FORM_ACTIONS[variant]}
    {name}
    {superform}
    {...$$restProps} />
