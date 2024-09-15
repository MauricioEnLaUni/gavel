<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$lib/utils";
    import type { SelectOptions } from "./types";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let etiqueta: {
        children: string;
        classes?: string;
    } = { children: "" };
    export let select: any = {};
    export let opciones: SelectOptions[] = [];

    export let name: Leaf;
    export let superform: GenT;

    export let firstOption: SelectOptions[];
    const primerasOpciones =
        firstOption.length === 0
            ? [
                  {
                      llave: "",
                      valor: "Please select an option",
                  },
              ]
            : firstOption;

    const { value, errors, constraints } = formFieldProxy(superform, name);
</script>

<section class="flex flex-wrap justify-center">
    <input {name} type="hidden" id={`${name}-input`} bind:value={$value} />
    {#if etiqueta}
        <p class={cn("w-full text-center text-sm font-bold", etiqueta.classes)}>
            {etiqueta.children}
        </p>
    {/if}
    <select
        id={`${name}-select`}
        {name}
        {...select}
        class={cn("select select-bordered w-full max-w-xs", select.classes)}
        aria-invalid={$errors ? "true" : undefined}
        {...$constraints}
        {...$$restProps}
        bind:value={$value}>
        {#each [...primerasOpciones, ...opciones] as { llave, valor, opc }}
            <option class={cn("", opc?.classes)} value={llave}>{valor}</option>
        {/each}
    </select>
</section>
