<script>
	import avatar from '$lib/images/avatar.png';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="about">
	<h1>About Me</h1>
	<img src={avatar}  alt="avatar"/>
	<p>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
		ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco 
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in 
		voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
		non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
	</p>
</div>

<style>
	.about img {
		max-width: 100%;
		height: auto;
	}
</style>
