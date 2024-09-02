<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import type { SuperValidated } from "sveltekit-superforms";

    export let data: SuperValidated<Record<string, unknown>>;
    export let method: "GET" | "POST" = "POST";

    export let formOptions: any;

    export const superform = superForm(data, formOptions);

    const { form, message, delayed, errors, allErrors, enhance } = superform;
</script>

<form {method} use:enhance {...$$restProps}>
    <slot
        {superform}
        form={$form}
        message={$message}
        errors={$errors}
        allErrors={$allErrors}
        delayed={$delayed} />
</form>
