<script>
	import A from "$lib/components/demo/Demo.SvelteComponent.A.svelte";
	import B from "$lib/components/demo/Demo.SvelteComponent.B.svelte";
	const components = { A, B };

	const data = [
		{
			component: "A",
			number: 42
		},
		{
			component: "B",
			name: "Russell"
		}
	];
</script>

<section id="demo-component">
	<h2>Dynamic Svelte Component</h2>
	{#each data as d}
		<svelte:component this={components[d.component]} {...d} />
	{/each}
</section>
