<script lang="ts">
    import { formFieldProxy } from "sveltekit-superforms";
    import { cn } from "$utl/cn";
    import type { Leaf,GenT } from "$cmp/superforms/types";

    export let container: any = {};
    export let etiqueta: any = {};
    export let input: any = {};

    export let name: Leaf;
    export let superform: GenT;

    export let toggled: boolean = true;

    const { value, constraints } = formFieldProxy(superform, name);

    function setMoving() {
        const toggle = document.querySelector(`#${name}-sino-toggle`);

        if (!toggle) return;

        const currentClass = toggle.classList;

        const v = $value === undefined && toggled ? toggled : $value;
        if (!v) {
            currentClass.remove("toggle--on");
            currentClass.add("toggle--off");
            $value = true;
        } else {
            currentClass.add("toggle--on");
            currentClass.remove("toggle--off");
            $value = false;
        }
        currentClass.add("toggle--moving");

        setTimeout(function () {
            toggle.classList.remove("toggle--moving");
        }, 200);
    }

    $value = toggled;
    $: state = (toggled && $value === undefined) || $value ? "toggle--on" : "toggle--off";
</script>

<div {...container} class={cn("flex w-full justify-center text-center",container.classes)}>
    <div class="flex flex-wrap justify-center">
        <button
            {...etiqueta}
            type="button"
            class={cn("mb-1 w-full font-bold",etiqueta.classes)}
            on:click|preventDefault={setMoving}
        >{etiqueta.children}</button>
        <button id={`${name}-sino-toggle`} class={`togs ${state} w-full cursor-pointer`} on:click|preventDefault={setMoving}>
            <input {...input} type="checkbox" id={`${name}-toggle`} {name} class="hidden" bind:checked={$value} {...$constraints} />
        </button>
    </div>
</div>

<div class="toggle--off toggle--moving hidden"></div>

<style lang="scss">
    .togs {
        position: relative;
        display: block;
        margin: 0 auto;
        width: 60px;
        height: 30px;
        color: white;
        outline: 0;
        text-decoration: none;
        border-radius: 100px;
        border: 1px solid #546e7a;
        background-color: #263238;
        transition: all 500ms;
        &:active {
            background-color: darken(#263238, 5%);
        }
        &:hover:not(.toggle--moving) {
            &:after {
                background-color: #455a64;
            }
        }
        &:after {
            display: block;
            position: absolute;
            top: 2px;
            bottom: 2px;
            left: 2px;
            width: calc(50% - 4px);
            line-height: 20px;
            text-align: center;
            text-transform: uppercase;
            font-size: 9px;
            font-weight: 700;
            color: white;
            background-color: #37474f;
            border: 1px solid;
            transition: all 500ms;
        }
    }
    .toggle--on {
        &:after {
            content: "YES";
            border-radius: 50px 5px 5px 50px;
            color: #66bb6a;
        }
    }
    .toggle--off {
        &:after {
            content: "NO";
            border-radius: 5px 50px 50px 5px;
            transform: translate(100%, 0);
            color: #f44336;
        }
    }
    .toggle--moving {
        background-color: darken(#263238, 5%);
        &:after {
            color: transparent;
            border-color: darken(#546e7a, 8%);
            background-color: darken(#37474f, 10%);
            transition:
                color 0s,
                transform 500ms,
                border-radius 500ms,
                background-color 500ms;
        }
    }
</style>
