<script>
  let { wishes } = $props();
</script>

<section class="wishes" id="wishes">
  <div class="container">
    <div class="section-header">
      <h2>Best Wishes</h2>
      <div class="divider"></div>
      <p class="subtitle">With love from our dearest ones</p>
    </div>
    <div class="wishes-grid">
      {#each wishes as wish}
        <div class="wish-card">
          <div class="img-container">
            <img src={wish.image} alt={wish.name} loading="lazy" />
          </div>
          <div class="wish-content">
            <h4>{wish.name}</h4>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .wishes {
    padding: 6rem 2rem;
    background-color: var(--color-secondary);
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
  }
  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }
  .section-header h2 {
    font-size: 2.5rem;
    color: var(--color-accent);
    margin-bottom: 1rem;
  }
  .divider {
    width: 60px;
    height: 2px;
    background-color: var(--color-primary);
    margin: 0 auto 1rem auto;
  }
  .subtitle {
    font-size: 1.1rem;
    color: var(--color-text-light);
    font-style: italic;
    font-family: var(--font-heading);
  }
  .wishes-grid {
    display: flex;
    gap: 2rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  .wish-card {
    background: var(--color-bg);
    border-radius: 12px;
    overflow: hidden;
    width: 300px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: var(--transition-smooth);
  }
  .wish-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  }
  .img-container {
    width: 100%;
    height: 350px;
    overflow: hidden;
  }
  .img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }
  .wish-card:hover .img-container img {
    transform: scale(1.05);
  }
  .wish-content {
    padding: 1.5rem;
    text-align: center;
  }
  .wish-content h4 {
    margin: 0;
    font-size: 1.4rem;
    color: var(--color-accent);
  }
</style>
