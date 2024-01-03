<script>
	import { onMount } from 'svelte';
    import * as maplibregl from "maplibre-gl";
	
	/** @type {maplibregl.Map} */
	let map;
    /** @type {HTMLElement}*/
	let mapContainer;

	onMount(() => {
		map = new maplibregl.Map({
			container: mapContainer,
			style: "https://demotiles.maplibre.org/style.json",
			center: [0, 0],
			zoom: 1
		})
		return (() => {map.remove()})
	})
</script>

<div class="map" bind:this={mapContainer}></div>

<style>
    .map {
        height: 100%;
    }
</style>