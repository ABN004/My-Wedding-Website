<script>
  import Loader from '$lib/components/Loader.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Landing from '$lib/components/Landing.svelte';
  import About from '$lib/components/About.svelte';
  import Event from '$lib/components/Event.svelte';
  import Wishes from '$lib/components/Wishes.svelte';
  import data from '$lib/data.json';
</script>

<svelte:head>
  <title>{data.bride.name} & {data.groom.name} - Wedding Invitation</title>
</svelte:head>

<Loader />
<Navbar />

<main>
  <Landing data={data} />
  <About bride={data.bride} groom={data.groom} />
  <Event events={data.wedding.events} />
  <Wishes wishes={data.wishes} />
</main>

<style>
  main {
    width: 100%;
    overflow-x: hidden;
  }
</style>
