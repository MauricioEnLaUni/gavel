<script lang="ts">
    import PokemonCard from "./PokemonCard.svelte";

    async function getPokemon(n: number | undefined) {
        if (n === undefined) return;
        if (isNaN(Number(n))) {
            throw new Error("Invalid Input");
        }
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${n}`);
        const data = await response.json();

        const abilities = data.abilities.map(({ ability }: { ability: { name: string } }) => ability.name);
        const name = data.name;
        const stats = data.stats.map(({ base_stat, stat }: { base_stat: number; stat: { name: string; url: string; }}) => {
            return {
                base_stat,
                name: stat.name
            }
        });
        const types = data.types.map(({ type }: { type: { name: string }}) => {
            return type.name;
        });

        return {
            abilities,
            name,
            stats,
            types
        }
    }

    $: value = 35;
    $: currentImg = 35;
    let promise = getPokemon(value);
    function handleClick() {
        console.log(value);
        currentImg = value;
        promise = getPokemon(value);
    }
</script>

<div class="flex justify-center w-full min-h-screen items-center">
    {#await promise}
        <span class="flex loader"></span>
    {:then text}
        <label class="font-bold">
            Choose your Pokémon: <input class="pl-8" name="get-pokemon" type="number" bind:value />
        </label>
        <button on:click={handleClick}>SUBMIT</button>
        {#if text}
            <PokemonCard
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{currentImg}.png"
                alt="Imagen de {text.name}"
                name={text.name}
                abilities={text.abilities}
                types={text.types}
            />
        {/if}
    {:catch error}
        <p>Ha ocurrido un error: {error}</p>
    {/await}
</div>

<style>
    .loader {
        width: 48px;
        height: 48px;
        border: 3px dotted #FFF;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        animation: rotation 2s linear infinite;
    }
    .loader::after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        border-width: 3px;
        border-color: #FF3D00;
        border-style: solid solid dotted;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        animation: rotationBack 1s linear infinite;
        transform-origin: center center;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes rotationBack {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
</style>
