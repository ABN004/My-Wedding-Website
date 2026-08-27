<script>
  let { bride, groom } = $props();
</script>

<section class="about" id="about">
  <div class="container">
    <div class="section-header">
      <p class="kicker">✦ The two families ✦</p>
      <h2>The Couple</h2>
      <div class="divider"></div>
    </div>
    <div class="couple-cards">
      <div class="card groom"><span class="card-flower">✿</span>
        <h3>{groom.name}</h3>
        <p class="parents">Son of<br><strong>{groom.father}</strong> & <strong>{groom.mother}</strong></p>
        <p class="address">{groom.address}</p>
      </div>

      <div class="joining" aria-hidden="true"><span>ॐ</span></div>
      <div class="card bride"><span class="card-flower">✿</span>
        <h3>{bride.name}</h3>
        <p class="parents">Daughter of<br><strong>{bride.father}</strong> & <strong>{bride.mother}</strong></p>
        <p class="address">{bride.address}</p>
      </div>
    </div>
  </div>
</section>

<style>
  .about {
    padding: 6rem 2rem;
    background: radial-gradient(circle at 20% 10%, #fffdf5 0 2px, transparent 3px) 0 0/28px 28px, var(--color-secondary);
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
    font-size: clamp(2.7rem, 5vw, 4rem);
    color: var(--color-accent);
    margin-bottom: 1rem;
  }
  .divider {
    width: 90px;
    height: 2px;
    background-color: var(--color-primary);
    margin: 0 auto;
  }
  .couple-cards {
    display: flex;
    gap: 1.3rem;
    justify-content: center;
  }
  .card {
    flex: 1;
    background: var(--color-bg);
    padding: 3rem 2rem;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    transition: var(--transition-smooth);
    border: 1px solid rgba(180, 119, 39, .28);
    position: relative;
    overflow: hidden;
  }
  .card:hover {
    transform: translateY(-10px);
    border-color: var(--color-primary);
    box-shadow: 0 15px 40px rgba(0,0,0,0.08);
  }
  .card h3 {
    font-size: 2rem;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
  }
  .kicker { margin: 0 0 .5rem; color: var(--saffron); font-size: .68rem; text-transform: uppercase; letter-spacing: .19em; font-weight: 600; }
  .card::before, .card::after { content: ''; position: absolute; width: 55px; height: 55px; border-color: var(--gold); opacity: .55; }
  .card::before { border-top: 1px solid; border-left: 1px solid; top: 10px; left: 10px; }.card::after { border-bottom: 1px solid; border-right: 1px solid; right:10px; bottom:10px; }
  .card-flower { display:block; color:var(--saffron); font-size:1.3rem; margin-bottom:.35rem; }.joining { display:grid; place-items:center; align-self:center; width:44px; height:44px; border:1px solid var(--gold); color:var(--maroon); border-radius:50%; background:var(--cream); z-index:1; font-size:1.2rem; }
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
    .couple-cards { flex-direction: column; }.joining { margin:-.6rem auto; }
  }
</style>
