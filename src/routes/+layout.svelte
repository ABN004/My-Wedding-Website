<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/images/Loader_Logo.png" />
	<link rel="apple-touch-icon" href="/images/Loader_Logo.png" />
</svelte:head>
{@render children()}
