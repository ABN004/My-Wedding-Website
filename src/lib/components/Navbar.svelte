<script>
  import { onMount } from 'svelte';
  
  let scrolled = $state(false);
  
  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<nav class:scrolled>
  <div class="nav-container">
    <div class="logo">G <span>&</span> A</div>
    <div class="links">
      <a href="#home">Home</a>
      <a href="#about">Couple</a>
      <a href="#events">Events</a>
      <a href="#wishes">Wishes</a>
    </div>
  </div>
</nav>

<style>
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 100;
    padding: 1.5rem 2rem;
    transition: var(--transition-smooth);
  }
  nav.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  }
  .nav-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    transition: color 0.3s ease;
  }
  .logo span {
    color: var(--color-primary);
    font-style: italic;
  }
  nav.scrolled .logo {
    color: var(--color-accent);
  }
  .links {
    display: flex;
    gap: 2rem;
  }
  .links a {
    color: rgba(255,255,255,0.9);
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: var(--transition-smooth);
    position: relative;
    font-weight: 500;
  }
  nav.scrolled .links a {
    color: var(--color-text);
  }
  .links a:hover {
    color: var(--color-primary);
  }
  .links a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: var(--color-primary);
    transition: width 0.3s ease;
  }
  .links a:hover::after {
    width: 100%;
  }
  @media (max-width: 768px) {
    .links { display: none; }
  }
</style>
