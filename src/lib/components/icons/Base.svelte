<script lang="ts">
    export let width: string = "24";
    export let height: string = "24";
    export let stroke: string = "currentColor";
    export let viewBox: string = "0 0 24 24";
    export let fill: string = "none";

    export let classes: string = "";
</script>

<div class={classes}>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        {width}
        {height}
        {viewBox}
        {fill}
        {stroke}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-trash-2">
        <slot />
    </svg>
</div>
