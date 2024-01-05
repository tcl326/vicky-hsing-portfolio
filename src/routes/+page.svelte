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
    import * as turf from "@turf/turf";

    /** @type {maplibregl.Map} */
    let map;
    /** @type {HTMLElement}*/
    let mapContainer;
	/** @type {number} */
	let storyIndex;
    /** @type {number} */
    let currIndex;
    /** @type {maplibregl.Marker} */
    let currMarker
    /** @type {maplibregl.Marker[]} */
    let markers = []
    /** @type {GeoJSON.Feature<GeoJSON.LineString|GeoJSON.MultiLineString>[]}*/
    let paths = []


    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            style: "https://api.maptiler.com/maps/207be6f9-e48d-4286-b42f-36705cd7d5ac/style.json?key=49Eq5quK44ld8bMD3QQO",
            center: [-74.5, 40],
            zoom: 7,
        });
        map.fitBounds(
            turf.bbox(turf.featureCollection(
                Object.values(location).map(key => key.location)
            ))
        )
        map.on('load', () => {initMarkers(); initPath();});
        return () => {
            map.remove();
        };
    });

    /** 
     * @typedef Location
     * @type {object}
     * @property {GeoJSON.Feature<GeoJSON.Point>} location
     */

    /** @type {Object.<String, Location>} */
    const location = {
        nampo: {
            location: turf.point([125.41234077557591, 38.73453592320027]),
        },
        pyongyang: {
            location: turf.point([125.73797734309451, 39.00668796247874]),
        },
        tianjin: {
            location: turf.point([117.20538400209956, 39.145503525618885]),
        },
        nanjing: {
            location: turf.point([118.77477891245857, 32.07440841614481]),
        },
        shanghai: {
            location: turf.point([121.4808215280902, 31.240368290210927]),
        },
        yangon: {
            location: turf.point([96.17537272477527, 16.844503498697378]),
        },
        lashio: {
            location: turf.point([97.75118358851516, 22.96814045074412]),
        },
        tengchong: {
            location: turf.point([98.4906377149734, 25.019502010618968]),
        },
        longlin: {
            location: turf.point([105.34281456331065, 24.778011077317235]),
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

    /**
     * @callback Action
    */

    /** 
     * @typedef Story
     * @type {object}
     * @property {Action} action
     * @property {String} text
     */
    
    /** @type {Story[]} */
    const story = [
        {
            action: () => {
                fitMap();
            },
            text: "overview",
        }
    ]
    
    itinary.forEach(
        (it, index) => {
            story.push(
                {
                    action: () => {
                        fitPath(paths[index])
                    },
                    text: it.start.concat("-", it.end)
                }
            )
        }
    )

    /**
     * Fit map to the given path
     * @param {GeoJSON.Feature<GeoJSON.LineString|GeoJSON.MultiLineString>} path
     */
    function fitPath(path) {
        if (path) {
            map.fitBounds(
                turf.bbox(path),
                {
                    padding: 50,
                }
            );
        };
    }

    function fitMap(){
        map.fitBounds(
            turf.bbox(turf.featureCollection(
                Object.values(location).map(key => key.location)
            )),
            {
                padding: 50
            }
        );
    }

    function initMarkers() {
        if (markers.length == 0) {
            markers = Object.values(location).map(it => {
                const marker = new maplibregl.Marker()
                    .setLngLat(it.location.geometry.coordinates)
                    .addTo(map);
                return marker
            })
        }
    }

    function initPath() {
        if (paths.length == 0) {
            paths = itinary.map(it => turf.greatCircle(location[it.start].location, location[it.end].location, {properties: {id: it.start.concat("_", it.end)}}))
            paths.map(
                (p) => {
                    map.addSource(
                        p.properties?.id,
                        {
                            "type": "geojson",
                            "data": p,
                        }
                    );
                    map.addLayer(
                        {
                            'id': p.properties?.id,
                            'type': "line",
                            'source': p.properties?.id,
                            'layout': {
                                'line-join': 'round',
                                'line-cap': 'round',
                            },
                            'paint': {
                                'line-color': '#888',
                                'line-width': 8,
                            }
                        }
                    )
                }
            )
        }
    }

    /** @param {number} storyIndex */
    function setCurrIndex(storyIndex) {
        if (storyIndex !== currIndex) {
            currIndex = storyIndex
        }
    }

    // function moveMarker(itinaryIndex) {
    //     if (currMarker) {
    //         currMarker.remove();
    //     }
    //     currMarker = new maplibregl.Marker()
    //         .setLngLat(
    //             location[itinary[itinaryIndex].start].location.geometry.coordinates
    //         ).addTo(map);
    //     console.log(currMarker)
    // }
    $: setCurrIndex(storyIndex) 
    $: currIndex && story[currIndex].action() && console.log(currIndex)
</script>

<h1>
    Park Young-Shim's displacement 
</h1>

<button on:click={() => {initMarkers(); fitMap(); initPath();}}>See All</button>

<ScrollyHarris bind:id={storyIndex} splitscreen={true}>
	<div slot="background">
		<div class="map-wrapper">
			<div class="map" bind:this={mapContainer}></div>
		</div>
	</div>
	<div slot="foreground" style="padding: 0 0 0 50%;">
		{#each story as item, index}
			<section class="itinary-wrapper" data-id="{index}" class:active={storyIndex === index}>
				<p>{item.text}</p>
			</section>
		{/each}
	</div>
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

    button {
        background-color: blue;
    }
</style>
