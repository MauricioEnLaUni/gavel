<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import { superForm } from "sveltekit-superforms";

    import { genPill, genTag } from "$utl/forms";
    import FormCatalog from "$cmp/superforms/formCatalog.svelte";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { registerSchema } from "./schema";

    export let data: { form: any; };
    const { form: registerForm } = data;

    const fields = ["username","email","password","repeat"]
        .map((e: string, index) => {
            const tag = m[`register_tag_${e}`];
            const options = index < 2 ? {} : {
                type: "password"
            };

            return genTag(tag(),e,{},{},options);
        });
    const terms = genPill(m.register_tag_terms(),{},{},{},true,"terms");

    const superform = superForm(registerForm, {
        dataType: "form",
        invalidateAll: true,
        clearOnSubmit: "errors-and-message",
        validators: zodClient(registerSchema),
        validationMethod: "onblur",
        resetForm: false,
        delayMs: 100,
        timeoutMs: 5000,
    });
    const { form,enhance } = superform;
</script>

<div class="grid min-h-screen grid-cols-1 lg:grid-cols-2 z-10">
    <div class="flex items-center justify-between bg-muted p-6 lg:p-12">
        <div class="mx-auto w-full max-w-md space-y-6 px-8 rounded-2xl py-8 bg-primary/25">
            <div class="space-y-2 text-center pb-4">
                <h1 class="text-3xl font-bold text-neutral-900">{m.register_submit()}</h1>
            </div>
            <form class="grid gap-4" method="POST" use:enhance>
                {#each fields as {name,selection,variant,rest}}
                    <FormCatalog {superform} {name} {selection} {variant} {...rest} />
                {/each}
                <!--
                <label>
                    {m.register_tag_terms()}
                    <input type="checkbox" name="terms" on:change|preventDefault={setTerms} bind:checked />
                </label>-->
                <FormCatalog {superform} name={terms.name} selection={terms.selection} variant={terms.variant} {...terms.rest} />
                <button
                    class="btn btn-secondary font-black"
                    type="submit"
                >
                    {m.register_submit()}
                </button>
            </form>
        </div>
    </div>
</div>
