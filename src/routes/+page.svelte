<svelte:head>
	<link
		rel="stylesheet"
		href='https://unpkg.com/maplibre-gl@3.3.1/dist/maplibre-gl.css'
	/>
</svelte:head>

<script>
	import ScrollyHarris from "$lib/components/ScrollyHarris.svelte"
    import { onMount } from "svelte";
    import * as maplibregl from "maplibre-gl";

    /** @type {maplibregl.Map} */
    let map;
    /** @type {HTMLElement}*/
    let mapContainer;
	/** @type {number} */
	let itinaryIndex;
    /** @type {number} */
    let currIndex;
    /** @type {maplibregl.Marker}*/
    let currMarker

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            style: "https://demotiles.maplibre.org/style.json",
            center: [-74.5, 40],
            zoom: 9,
        });
        return () => {
            map.remove();
        };
    });

    const location = {
        nampo: {
            location: [38.73453592320027, 125.41234077557591],
        },
        pyongyang: {
            location: [39.00668796247874, 125.73797734309451],
        },
        tianjin: {
            location: [39.145503525618885, 117.20538400209956],
        },
        nanjing: {
            location: [32.07440841614481, 118.77477891245857],
        },
        shanghai: {
            location: [31.240368290210927, 121.4808215280902],
        },
        yangon: {
            location: [16.844503498697378, 96.17537272477527],
        },
        lashio: {
            location: [22.96814045074412, 97.75118358851516],
        },
        tengchong: {
            location: [25.019502010618968, 98.4906377149734],
        },
        longlin: {
            location: [24.778011077317235, 105.34281456331065],
        },
    };

    const itinary = [
        {
            start: "nampo",
            end: "pyongyang",
            year: 1939,
            month: 8,
            day: undefined,
        },
        {
            start: "pyongyang",
            end: "tianjin",
            year: 1939,
            month: 8,
            day: undefined,
        },
        {
            start: "tianjin",
            end: "nanjing",
            year: 1939,
            month: 8,
            day: undefined,
        },
        {
            start: "nanjing",
            end: "shanghai",
            year: 1945,
            month: 5,
            day: undefined,
        },
        {
            start: "shanghai",
            end: "yangon",
            year: 1942,
            month: 8,
            day: 20,
        },
        {
            start: "yangon",
            end: "lashio",
            year: 1944,
            month: 8,
            day: undefined,
        },
        {
            start: "lashio",
            end: "tengchong",
            year: 1944,
            month: undefined,
            day: undefined,
        },
        {
            start: "tengchong",
            end: "longlin",
            year: undefined,
            month: undefined,
            day: undefined,
        },
    ];

    /** @param {number} itinaryIndex */
    function setCurrIndex(itinaryIndex) {
        if (itinaryIndex !== currIndex) {
            currIndex = itinaryIndex
        }
    }

    function moveMarker(itinaryIndex) {
        if (currMarker) {
            currMarker.remove();
        }
        currMarker = new maplibregl.Marker()
            .setLngLat(
                [...location[itinary[itinaryIndex].start].location.toReversed()]
            ).addTo(map);
        console.log(currMarker)
    }
    $: setCurrIndex(itinaryIndex) 
    $: currIndex && map.flyTo({
        center: [
                ...location[itinary[currIndex].start].location.toReversed()
            ],
            essential: true 
        }) && moveMarker(currIndex)
</script>

<h1>
    Park Young-Shim's displacement 
</h1>

<ScrollyHarris bind:id={itinaryIndex} splitscreen={true}>
	<div slot="background">
		<div class="map-wrapper">
			<div class="map" bind:this={mapContainer}></div>
		</div>
	</div>
	<div slot="foreground" style="padding: 0 0 0 50%;">
		{#each itinary as item, index}
			<section class="itinary-wrapper" data-id="{index}" class:active={itinaryIndex === index}>
				<p>{item.start} - {item.end}</p>
				<p>{location[item.start].location}</p>
			</section>
		{/each}
	</div>
	{console.log(itinaryIndex)}
</ScrollyHarris>


<style>
    .map {
        height: 100%;
    }
	.map-wrapper {
		/* height: 100%; */
		height: 500px;
	}
/* 
	section {
        padding: 25px 50px;
        line-height: 25px;
        border-bottom: 1px solid #ddd;
        opacity: 0.25;
        font-size: 13px;
        height: 100vh;
    }
    section.active {
        opacity: 1;
    }


    svelte-scroller-background-container {
	pointer-events: all !important;
} */
    [slot="background"] {
		background-color: rgba(255,62,0,0.05);
		border-top: 2px solid #ff3e00;
		border-bottom: 2px solid #ff3e00;
		font-size: 1.4em;
		overflow: hidden;
		padding: 1em;
	}
	
	[slot="background"] p {
		margin: 0;
	}
	
	[slot="foreground"] {
		pointer-events: none;
	}
	
	[slot="foreground"] section {
		pointer-events: all;
	}
	
	section {
		height: 80vh;
		background-color: rgba(0,0,0,0.5);
		color: white;
		padding: 1em;
		margin: 0 0 2em 0;
	}
</style>
