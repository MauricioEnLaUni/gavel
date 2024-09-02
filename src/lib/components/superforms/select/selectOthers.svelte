<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils";
    import type { GenT, Leaf } from "$cmp/superforms/types";
    import type { SelectOptions } from "$cmp/superforms/select/types";

    export let etiqueta:
        | {
              children: string;
          }
        | undefined;
    export let container: any = {};
    export let select: any = {};
    export let opciones: SelectOptions[] = [];
    export let otros: string[] = [];

    export let otroContainer: any = {};
    export let otroEtiqueta: any = {};
    export let otroInput: any = {};

    const o = new Set<string>(otros);

    export let name: Leaf;
    export let superform: GenT;

    export let firstOption: SelectOptions = {
        llave: "",
        valor: "*** Seleccione una opción ***",
    };

    const { value, errors, constraints } = formFieldProxy(superform, name);
    $: disabled = o.has(String($value));
</script>

<section
    {...container}
    class={cn(
        "flex w-[392px] flex-wrap justify-center",
        container?.classes ?? "",
    )}>
    <input {name} type="hidden" id={`${name}-input`} bind:value={$value} />
    {#if etiqueta}
        <p class="w-full text-center text-sm font-bold">{etiqueta.children}</p>
    {/if}
    <select
        id={`${name}-select`}
        {name}
        aria-invalid={$errors ? "true" : undefined}
        {...select}
        {...$constraints}
        {...$$restProps}
        bind:value={$value}
        class={cn(
            "select select-bordered w-full max-w-xs text-center",
            select?.classes ?? "",
        )}>
        {#each [firstOption, ...opciones] as { llave, valor, opc }}
            <option class={cn("", opc?.classes)} value={llave}>{valor}</option>
        {/each}
    </select>
    <div {...otroContainer}>
        <label {...otroEtiqueta}>
            {otroEtiqueta.children}
            <input type="text" {...otroInput} {disabled} />
        </label>
    </div>
</section>
