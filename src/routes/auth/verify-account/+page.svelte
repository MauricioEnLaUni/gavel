<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import { page } from "$app/stores";

    const params = $page.url.searchParams;
    const username = String(params.get("username"));
    const email = String(params.get("email"));
</script>

<main class="">
    <h1>{m.verify_account_title()}</h1>
    <section>
        <div>
            <p>{m.verify_account_confirm_username().replace("ᛟ",username)}</p>
            <p>{m.verify_account_confirm_email().replace("ᛟ",email)}</p>
        </div>
    </section>
</main>
