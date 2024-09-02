<script lang="ts">
    import { cn } from "$utl/cn";

    export let height: number = 8;
    export let width: number = 8;

    const h = `h-${height}`;
    const w = `w-${width}`;
</script>

<div class={cn("skeleton shrink-0 rounded-full", `${h} ${w}`)}></div>
