<script lang="ts" context="module">
    type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
    import { cn } from "$lib/utils/cn";
    import {
        formFieldProxy,
        type FormPathLeaves,
        type SuperForm,
    } from "sveltekit-superforms";

    export let name: FormPathLeaves<T>;
    export let superform: SuperForm<T>;

    const { constraints } = formFieldProxy(superform, name);
</script>

<div {...$$restProps.container} class={cn("", $$restProps.container?.classes ?? "")}>
    <input {name} type="submit" class={cn("btn btn-outline btn-primary", $$restProps.input?.classes ?? "")} {...$constraints} {...$$restProps.input} />
</div>
