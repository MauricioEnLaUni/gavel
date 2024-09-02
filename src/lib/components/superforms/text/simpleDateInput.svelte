<script lang="ts">
    import { DateInput } from "date-picker-svelte";

    const today = new Date();
    const min = new Date(Date.UTC(1900, 0, 2));
    const placeholder = today
        .toISOString()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("-");

    const max = today;
    const format = "dd-MM-yyyy";

    export let value: Date;
</script>

<div>
    <DateInput {format} {placeholder} {min} {max} bind:value {...$$restProps} />
</div>
