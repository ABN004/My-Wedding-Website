<script>
  import Loader from '$lib/components/Loader.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Landing from '$lib/components/Landing.svelte';
  import About from '$lib/components/About.svelte';
  import Event from '$lib/components/Event.svelte';
  import Wishes from '$lib/components/Wishes.svelte';
  import jsonData from '$lib/data.json';

  let { data } = $props();

  const title = `${jsonData.bride.name} & ${jsonData.groom.name} - Wedding Invitation`;
  const description = `Join us to celebrate the wedding of ${jsonData.bride.name} and ${jsonData.groom.name} on ${jsonData.wedding.events[0].date}.`;
  const image = '/images/Loader_Logo.png';
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content={description} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
</svelte:head>

<Loader />
<Navbar />

<main>
  <Landing data={jsonData} />
  <About bride={jsonData.bride} groom={jsonData.groom} />
  <Event events={jsonData.wedding.events} />
  <Wishes wishes={data.wishes} />
</main>

<style>
  main {
    width: 100%;
    overflow-x: hidden;
  }
</style>