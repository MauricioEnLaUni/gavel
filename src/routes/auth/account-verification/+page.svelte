<script lang="ts">
    import { redirect } from "@sveltejs/kit";
    import * as m from "$lib/paraglide/messages";
    import { onMount } from "svelte";

    export let data: { success: number };
    const { success } = data;

    if (success === 0 || !data) {
        redirect(301, "/");
    }

    onMount(() => {
        if (success === 1) {
            setTimeout(() => {
                redirect(302, "/");
            }, 4000);
        }
    });
</script>

<main>
    {#if success === 1}
        <h1>{m.account_verification_success()}</h1>
    {:else if success === 2}
        <h1>{m.account_verification_timeout()}</h1>
        <button type="button" class="link"
            >{m.resend_verification_email()}</button>
    {/if}
</main>
