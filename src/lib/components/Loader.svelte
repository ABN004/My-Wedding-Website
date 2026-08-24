<script>
  import { onMount } from 'svelte';
  let loaded = $state(false);
  onMount(() => {
    setTimeout(() => {
      loaded = true;
    }, 1500);
  });
</script>

<div class="loader-overlay" class:loaded>
  <img src="/images/Loader_Logo.png" alt="Loading" class="loader-logo" />
</div>

<style>
  .loader-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: var(--color-bg);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.8s ease-in-out, visibility 0.8s;
  }
  .loader-overlay.loaded {
    opacity: 0;
    visibility: hidden;
  }
  .loader-logo {
    width: 150px;
    height: auto;
    animation: pulse 2s infinite ease-in-out;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
</style>
