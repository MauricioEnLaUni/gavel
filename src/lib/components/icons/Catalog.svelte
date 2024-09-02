<script lang="ts">
    import Base from "$cmp/icons/Base.svelte";
    import Icon from "$cmp/loading/icon.svelte";
    import { CATALOG, type IconList } from "$cmp/icons/types";

    export let icon: IconList;
    let promise: Promise<any>;

    async function t() {
        return await CATALOG[icon]();
    }

    promise = t();
</script>

{#await promise}
    <Icon {...$$restProps} />
{:then icon}
    <Base {...$$restProps}>
        <svelte:component this={icon.default} />
    </Base>
{/await}
