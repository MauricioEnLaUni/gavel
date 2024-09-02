<script lang="ts">
    import { Icon, search as icon } from "$cmp/icons";
    import { cn } from "$lib/utils";
    import type { GenT, Leaf } from "$cmp/superforms/types";

    export let button: any;

    export let name: Leaf;
    export let superform: GenT;

    const { delayed } = superform;
</script>

<button
    {...button}
    {name}
    id={`${name}-button`}
    type="button"
    class={cn("btn btn-primary", button?.classes ?? "")}>
    {#if $delayed}
        <span class="loading loading-bars loading-lg"></span>
    {:else}
        <Icon {icon} />
    {/if}
    SEARCH
</button>
