<script lang="ts">
    export let message: { status: number; text: string } | undefined =
        undefined;
</script>

{#if message}
    <div
        role="alert"
        class={`alert ${message.status >= 400 ? "alert-error" : "alert-success"} border-4 border-sky-200 font-bold text-slate-950`}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-info"
            ><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path
                d="M12 8h.01" /></svg>
        <span>{message.text}</span>
    </div>
{/if}
