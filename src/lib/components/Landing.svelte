<script>
  let { data } = $props();
</script>

<section class="landing" id="home">
  <div class="landing-content">
    <div class="names">
      <h1>{data.bride.name}</h1>
      <span class="ampersand">&amp;</span>
      <h1>{data.groom.name}</h1>
    </div>
    <p class="date">We are getting married</p>
    <a href="#about" class="btn">Discover Our Story</a>
  </div>
  <div class="image-wrapper">
    <img src="/images/Couple_Image.png" alt="Couple" />
    <div class="overlay"></div>
  </div>
</section>

<style>
  .landing {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: var(--color-secondary);
    overflow: hidden;
  }
  .image-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
  }
  .landing-content {
    z-index: 1;
    padding: 2rem;
    animation: fadeInUp 1.5s ease-out;
  }
  .names {
    margin-bottom: 1.5rem;
  }
  .names h1 {
    font-size: 4rem;
    margin: 0;
    letter-spacing: 2px;
    font-weight: 400;
  }
  .ampersand {
    font-family: var(--font-heading);
    font-size: 3rem;
    color: var(--color-primary);
    display: block;
    margin: 0.5rem 0;
    font-style: italic;
  }
  .date {
    font-size: 1.2rem;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 2.5rem;
  }
  .btn {
    display: inline-block;
    padding: 1rem 2.5rem;
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: var(--transition-smooth);
    cursor: pointer;
  }
  .btn:hover {
    background-color: var(--color-primary);
    color: var(--color-secondary);
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @media (max-width: 768px) {
    .names h1 { font-size: 3rem; }
  }
</style>
