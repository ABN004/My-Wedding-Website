<script>
  import { page } from '$app/stores';
  import Loader from '$lib/components/Loader.svelte';
  import Navbar from '$lib/components/Navbar.svelte';
  import Landing from '$lib/components/Landing.svelte';
  import About from '$lib/components/About.svelte';
  import Event from '$lib/components/Event.svelte';
  import Wishes from '$lib/components/Wishes.svelte';
  import jsonData from '$lib/data.json';

  let { data } = $props();

  const title = `${jsonData.groom.name} & ${jsonData.bride.name} — Wedding Invitation`;
  const description = `With joyful hearts, ${jsonData.groom.name} and ${jsonData.bride.name} invite you to their wedding celebration at Guruvayur Temple on 01 November 2026.`;
  const shareImage = `${$page.url.origin}/images/Loader_Logo3.jpg`;
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content={description} />
  <meta name="theme-color" content="#68152a" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Amal & Greeshma" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={shareImage} />
  <meta property="og:image:secure_url" content={shareImage} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="900" />
  <meta property="og:image:alt" content="Amal and Greeshma's wedding invitation" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={shareImage} />
  <meta name="twitter:image:alt" content="Amal and Greeshma's wedding invitation" />
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
