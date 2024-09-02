<script lang="ts">
    export let src: string;
    export let alt: string;
    export let name: string;

    export let abilities: string[];

    export let types: string[];

    const formattedAbilities = abilities.map(e => {
        return e.split("-").map(e => e.slice(0,1).toUpperCase() + e.slice(1)).join(" ");
    });
</script>

<div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md" data-v0-t="card">
    <img
        {src}
        {alt}
        class="object-cover rounded-t-lg"
        width="180"
        height="125"
        style="aspect-ratio: 400 / 200; object-fit: cover;"
    />
    <div class="p-6 space-y-4">
        <h2 class="text-2xl font-bold">{name.slice(0,1).toUpperCase() + name.slice(1)}</h2>
        <div class="flex gap-2">
            {#each types as ty}
                <div>{ty.toUpperCase()}</div>
            {/each}
        </div>
        <ul class="space-y-2">
            {#each formattedAbilities as abi}
                <li class="flex items-center gap-3">
                    <span>{abi}</span>
                </li>
            {/each}
        </ul>
    </div>
</div>
