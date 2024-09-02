<script lang="ts" context="module">
    type T = Record<string, unknown>
</script>

<script lang="ts">
    import { TextInput } from "./TextInput";
    import { Select } from "./Select";
    import { GroupInput } from "./Group";
    import { Actions } from "./Actions";

    import type { SuperForm } from "sveltekit-superforms";
    import { type CatalogoCampos, SUPER_FIELDS } from "./types";

    export const INPUTS = new Map<CatalogoCampos, any>([
        [SUPER_FIELDS["TEXT-INPUT"], TextInput] as const,
        [SUPER_FIELDS["SELECT"], Select] as const,
        [SUPER_FIELDS["GROUP-INPUT"], GroupInput] as const,
        [SUPER_FIELDS["ACTIONS"], Actions] as const,
    ]);

    export let selection: CatalogoCampos = SUPER_FIELDS["TEXT-INPUT"];
    export let name: string = "";
    export let variant: any;
    export let superform: SuperForm<T>;
</script>

<svelte:component
    this={INPUTS.get(selection)}
    {name}
    {variant}
    {superform}
    {...$$restProps} />
