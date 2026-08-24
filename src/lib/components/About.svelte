<script>
  let { bride, groom } = $props();
</script>

<section class="about" id="about">
  <div class="container">
    <div class="section-header">
      <h2>The Couple</h2>
      <div class="divider"></div>
    </div>
    <div class="couple-cards">
      <div class="card bride">
        <h3>{bride.name}</h3>
        <p class="parents">Daughter of<br><strong>{bride.father}</strong> & <strong>{bride.mother}</strong></p>
        <p class="address">{bride.address}</p>
      </div>
      <div class="card groom">
        <h3>{groom.name}</h3>
        <p class="parents">Son of<br><strong>{groom.father}</strong> & <strong>{groom.mother}</strong></p>
        <p class="address">{groom.address}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .about {
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
    margin: 0 auto;
  }
  .couple-cards {
    display: flex;
    gap: 3rem;
    justify-content: center;
  }
  .card {
    flex: 1;
    background: var(--color-bg);
    padding: 3rem 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: var(--transition-smooth);
    border-top: 4px solid transparent;
  }
  .card:hover {
    transform: translateY(-10px);
    border-top-color: var(--color-primary);
    box-shadow: 0 15px 40px rgba(0,0,0,0.08);
  }
  .card h3 {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
  }
  .parents {
    font-size: 1.1rem;
    color: var(--color-text);
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  .parents strong {
    font-weight: 500;
  }
  .address {
    font-size: 0.95rem;
    color: var(--color-text-light);
    line-height: 1.5;
  }
  @media (max-width: 768px) {
    .couple-cards { flex-direction: column; }
  }
</style>
