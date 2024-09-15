<script lang="ts">
    import * as m from "$lib/paraglide/messages";
    import { page } from "$app/stores";

    const [username,email] = ["username","email"].map(e => String($page.url.searchParams.get(e)));
</script>

<main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
    <div class="bg-neutral-200 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div class="text-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-check-big text-success mx-auto mb-4"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/></svg>
            <h1 class="text-3xl font-bold text-gray-800 mb-2">{m.verify_account_title()}</h1>
            <p class="text-primary-content/70">{m.verify_account_subtitle()}</p>
        </div>
        <div class="bg-slate-300 rounded-md p-6 mb-6">
            <p class="text-primary-content mb-2">
                <span class="font-semibold">{m.verify_account_confirm_username_title()}</span>
                {m.verify_account_confirm_username().replace("ᛟ", username)}
            </p>
            <p class="text-primary-content">
                <span class="font-semibold">{m.verify_account_confirm_email_title()}</span>
                {m.verify_account_confirm_email().replace("ᛟ", email)}
            </p>
        </div>
        <div class="text-center">
            <a href="/" class="inline-block mt-4 px-6 py-2 bg-primary/90 text-white rounded-md hover:bg-primary transition-colors">
                {m.go_home()}
            </a>
        </div>
    </div>
</main>
