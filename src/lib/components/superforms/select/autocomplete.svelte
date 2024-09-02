<script lang="ts">
    export let items: string[] = [];

    export let value = "";

    function onItemClick(item: string) {
        (document!.activeElement! as HTMLButtonElement).blur();
        value = item;
    }

    $: filter = items.filter((item: string) =>
        item.toLowerCase().includes(value.toLowerCase()),
    );
</script>

<div class="dropdown">
    <input class="input input-bordered" bind:value />
    <ul
        class="menu dropdown-content z-[1] flex max-h-80 w-52 flex-nowrap overflow-auto rounded-box bg-base-100 p-2 shadow">
        {#each filter as item}
            <li>
                <button on:click|preventDefault={() => onItemClick(item)}
                    >{item}</button>
            </li>
        {/each}
    </ul>
</div>
