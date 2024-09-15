<script lang="ts">
    const fields: [string, { label: object; input: object }][] = [
        ["username", { label: {}, input: { placeholder: "Username" } }],
        [
            "password",
            { label: {}, input: { placeholder: "Password", type: "password" } },
        ],
    ] as [string, { label: object; input: object }][];
</script>

<div class="z-10 grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div class="bg-muted flex items-center justify-between p-6 lg:p-12">
        <div
            class="mx-auto w-full max-w-md space-y-6 rounded-2xl bg-primary/25 px-8 py-12">
            <div class="space-y-2 pb-4 text-center">
                <h1 class="text-3xl font-bold text-neutral-900">Login</h1>
            </div>
            <form class="grid gap-4" method="POST" action="?/login">
                {#each fields as [value, { label, input }]}
                    <div class="grid gap-1">
                        <label class="label font-black" {...label} for={value}>
                            {value.slice(0, 1).toUpperCase() + value.slice(1)}
                        </label>
                        <input
                            class="input border-primary/60"
                            {...input}
                            id={value}
                            name={value}
                            required />
                    </div>
                {/each}
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2"></div>
                    <a
                        class="text-sm font-bold text-primary underline underline-offset-4 hover:text-accent"
                        href="auth/password-restore">
                        Forgot your password?
                    </a>
                </div>
                <button class="btn btn-secondary font-black" type="submit">
                    LOGIN
                </button>
            </form>
        </div>
    </div>
</div>
