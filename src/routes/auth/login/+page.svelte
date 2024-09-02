<script lang="ts">
    const fields: [string, { label: object, input: object }][] = [
        ["username", { label: {}, input: { placeholder: "Username" } }],
        ["password", { label: {}, input: { placeholder: "Password", type: "password" }}],
    ] as [string, { label: object, input: object }][];
</script>

<div class="grid min-h-screen grid-cols-1 lg:grid-cols-2 z-10">
    <div class="flex items-center justify-between bg-muted p-6 lg:p-12">
        <div class="mx-auto w-full max-w-md space-y-6 px-8 rounded-2xl py-12 bg-primary/25">
            <div class="space-y-2 text-center pb-4">
                <h1 class="text-3xl font-bold text-neutral-900">Login</h1>
            </div>
            <form class="grid gap-4" method="POST" action="?/login">
                {#each fields as [valor, { label, input }]}
                    <div class="grid gap-1">
                        <label
                            class="label font-black"
                            {...label}
                            for={valor}
                        >
                            {valor.slice(0,1).toUpperCase() + valor.slice(1)}
                        </label>
                        <input
                            class="input border-primary/60"
                            {...input}
                            id={valor}
                            name={valor}
                            required
                        />
                    </div>
                {/each}
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                    </div>
                    <a class="text-sm font-bold underline underline-offset-4 text-primary hover:text-accent" href="auth/password-restore">
                        Forgot your password?
                    </a>
                </div>
                <button
                    class="btn btn-secondary font-black"
                    type="submit"
                >
                    LOGIN
                </button>
            </form>
        </div>
    </div>
</div>
