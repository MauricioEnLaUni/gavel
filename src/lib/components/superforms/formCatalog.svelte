<script lang="ts">
    import EntradaTexto from "./text/textInput.svelte";
    import Select from "./select/select.svelte";
    import InputGroup from "./groupInputs/inputGroup.svelte";
    import Actions from "./submit/actions.svelte";

    import { type FormFieldCatalog, type GenT, SUPER_FIELDS } from "./types";

    export const INPUTS = new Map<FormFieldCatalog, any>([
        [SUPER_FIELDS["TEXT-INPUT"], EntradaTexto] as const,
        [SUPER_FIELDS["SELECT"], Select] as const,
        [SUPER_FIELDS["GROUP-INPUT"], InputGroup] as const,
        [SUPER_FIELDS["ACTIONS"], Actions] as const,
    ] as const);

    export let selection: FormFieldCatalog = SUPER_FIELDS["TEXT-INPUT"];
    export let name: string = "";
    export let variant: any;
    export let superform: GenT;
</script>

<svelte:component
    this={INPUTS.get(selection)}
    {name}
    {variant}
    {superform}
    {...$$restProps} />
