<script>
	import DemoLink from "$lib/components/demo/Demo.Link.svelte";
	import DemoImg from "$lib/components/demo/Demo.Img.svelte";
	import DemoButtonSet from "$lib/components/demo/Demo.ButtonSet.svelte";
	import DemoRange from "$lib/components/demo/Demo.Range.svelte";
	import DemoSelect from "$lib/components/demo/Demo.Select.svelte";
	import DemoToggle from "$lib/components/demo/Demo.Toggle.svelte";
	import DemoSortTable from "$lib/components/demo/Demo.SortTable.svelte";
	import DemoLayerCake from "$lib/components/demo/Demo.LayerCake.svelte";
	import DemoSvelteElement from "$lib/components/demo/Demo.SvelteElement.svelte";
	import DemoSvelteComponent from "$lib/components/demo/Demo.SvelteComponent.svelte";
	import DemoFigure from "$lib/components/demo/Demo.Figure.svelte";
	import DemoTip from "$lib/components/demo/Demo.Tip.svelte";
	import DemoScrolly from "$lib/components/demo/Demo.Scrolly.svelte";
</script>

<div id="demo">
	<h1>Demo</h1>
	<DemoLink />
	<DemoImg />
	<DemoButtonSet />
	<DemoRange />
	<DemoSelect />
	<DemoToggle />
	<DemoSortTable />
	<DemoLayerCake />
	<DemoSvelteElement />
	<DemoSvelteComponent />
	<DemoTip />
	<DemoFigure />
	<DemoScrolly />
</div>

<style>
	#demo {
		max-width: 40rem;
		padding: 16px;
		margin: 0 auto;
	}

	:global(#demo section) {
		margin: 32px auto;
		padding-top: 32px;
	}

	:global(#demo h2 span) {
		background: var(--color-mark);
		padding: 0 8px;
	}
</style>
