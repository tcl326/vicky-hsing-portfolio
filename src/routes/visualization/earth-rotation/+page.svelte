<script lang="ts">
    import {
        geoOrthographic,
        geoPath,
        geoGraticule10,
        geoEqualEarth,
        geoAlbers,
    } from "d3-geo"
    import {
        pointer,
    } from "d3-selection"
    import * as quaternion from '$lib/utils/quaternion.js'

    export let data;

    const countryIdAccessor = d => d.properties["ADM0_A3_IS"]
    const countryNameAccessor = d => d.properties["NAME"]

    const margins = {
        top: 10,
        right: 40,
        bottom: 40,
        left: 40,
    };

    let width = 100;
    let worldMap = null;
    let wheelEventEndTimeout = null;
    $: height = width;

    $: dimensions = {
        width,
        height,
        margins: margins,
        boundedHeight: Math.max(
            height - margins.top - margins.bottom,
            0
        ),
        boundedWidth: Math.max(
            width - margins.left - margins.right,
            0
        )
    };
    const sphere = ({type: "Sphere"})
    $: projection = geoOrthographic()
        .fitWidth(dimensions.boundedHeight, sphere)
    $: pathGenerator = geoPath(projection)

    let dragStart = false;
    let cx = 0, cy = 0; 
    let qd1 = {};
    let qd2 = {};
    let q0 = {};
    let qdelta = {};
    let r0 = {};
    let long0, lat0;
    $: transform = {k: projection.scale()};

    function handleScroll(event) {
        function wheelDelta(event) {
            return -event.deltaY * (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) * (event.ctrlKey ? 10 : 1); 
        }
        if (wheelEventEndTimeout != null) {
            clearTimeout(wheelEventEndTimeout);
        };
        if (!dragStart) {
            console.log("zoom start")
            handleMouseDown(event);
        };

        wheelEventEndTimeout = setTimeout(() => {
            handleMouseUp();
            console.log("zoom end");
        }, 150)

        let k = transform.k * Math.pow(2, wheelDelta(event))
        projection = projection.scale(k)

        handleMouseMove(event);   
    }

    function handleMouseDown(event) {
        clearTimeout(wheelEventEndTimeout);
        dragStart = true;
        [long0, lat0] = projection.invert?.(pointer(event, worldMap)) ?? [0, 0];
        [cx, cy] = projection([long0, lat0]); 
        qd1 = quaternion.fromLongLat(long0, lat0);
        [r0.yaw, r0.pitch, r0.roll] = projection.rotate();
        q0 = quaternion.normalize(quaternion.fromAngles(r0));
    }

    function handleMouseMove(event) {
        if (!dragStart) {
            return
        }
        let q1 = {};
        let r1 = {};
        let long, lat;
        [long, lat] = projection.rotate([r0.yaw, r0.pitch, r0.roll]).invert?.(pointer(event, worldMap)) ?? [0, 0];
        qd2 = quaternion.fromLongLat(long, lat);
        qdelta = quaternion.normalize(quaternion.product(qd2, quaternion.conjugate(qd1)));
        q1 = quaternion.normalize(quaternion.product(q0, qdelta));
        r1 = quaternion.toAngles(q1);
        [cx, cy] = projection([long, lat]); 
        projection = projection.rotate([r1.yaw, r1.pitch, r1.roll]);
    }

    function handleMouseUp() {
        dragStart = false
    }
</script>

<div class="World Map" bind:clientWidth={width} bind:this={worldMap}>
    <svg width={dimensions.width} height={dimensions.height} viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g
            on:wheel|preventDefault={handleScroll}
            on:mousedown={handleMouseDown}
            on:mousemove={handleMouseMove}
            on:mouseup={handleMouseUp}
        >
            <path class="earth" d={pathGenerator(sphere)}/>
            <path class="graticule" d={pathGenerator(geoGraticule10())}/>
            {#if dragStart}
                {#each data.countries_json_110m.features as feature, i}
                    <path class="country" d={pathGenerator(feature)}/>
                {/each}
                <circle cx="{cx}" cy="{cy}" r="5" fill="red"/>
                {console.log("110m")}
            {:else}
                {#each data.countries_json_50m.features as feature, i}
                    <path class="country" d={pathGenerator(feature)}/>
                {/each}
                {console.log("50m")}
            {/if}
        </g>
    </svg>
</div>

<style>
    .earth {
        fill: #e2f1f1;
        stroke: none;
    }
    .graticule {
        stroke: #cadddd;
        fill: none;
    }
    .country:hover {
        fill: cornflowerblue;
    }

</style>