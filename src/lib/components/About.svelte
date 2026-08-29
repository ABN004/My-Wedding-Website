<script>
  import { onMount } from 'svelte';
  let { bride, groom } = $props();
  /** @type {HTMLElement} */
  let aboutSection;
  let scrollShift = $state(0);
  onMount(() => {
    /** @type {number | undefined} */
    let frame;
    const update = () => {
      frame = undefined;
      if (aboutSection) scrollShift = (window.innerHeight / 2 - aboutSection.getBoundingClientRect().top) * .11;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  });
</script>

<section class="about" id="about" bind:this={aboutSection} style={`--scroll-shift:${scrollShift}px`}>
  <div class="about-ornaments" aria-hidden="true">
    <span class="thali"><i>✦</i></span><span class="diya diya-one">🪔</span><span class="diya diya-two">🪔</span>
    <span class="manjal">✿</span><span class="lotus">❀</span><span class="om-symbol">ॐ</span><span class="nadaswaram"><i></i></span>
  </div>
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
    position:relative;
    isolation:isolate;
    overflow:hidden;
    padding: 6rem 2rem;
    background: radial-gradient(circle at 20% 10%, #fffdf5 0 2px, transparent 3px) 0 0/28px 28px, radial-gradient(ellipse at 50% 100%, rgba(231,183,73,.17), transparent 60%), var(--color-secondary);
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
    position:relative;
    z-index:2;
  }
  .about-ornaments span { position:absolute; pointer-events:none; user-select:none; }.thali { top:9%; left:-56px; display:grid; place-items:center; width:190px; height:190px; border:10px double rgba(198,139,35,.46); border-radius:50%; background:radial-gradient(circle, rgba(250,215,111,.8) 0 8%, transparent 9% 20%, rgba(225,169,55,.38) 21% 23%, transparent 24% 37%, rgba(225,169,55,.3) 38% 40%, transparent 41%); color:var(--maroon); font-size:2.2rem; transform:translate3d(0,calc(var(--scroll-shift) * -.38),0) rotate(-16deg); animation:thaliTurn 26s linear infinite; }.thali i{font-style:normal}.diya { font-size:3.4rem; filter:drop-shadow(0 8px 8px rgba(127,67,0,.18)); animation:float 4.2s ease-in-out infinite; }.diya-one { top:10%; right:7%; transform:translate3d(0,calc(var(--scroll-shift) * .2),0) rotate(-9deg); }.diya-two { bottom:7%; left:9%; transform:translate3d(0,calc(var(--scroll-shift) * -.17),0) rotate(10deg); animation-delay:-1.4s; }.manjal { top:50%; left:4%; color:#e7b037; font-size:5.5rem; opacity:.38; transform:translate3d(0,calc(var(--scroll-shift) * .35),0) rotate(12deg); animation:float 5s ease-in-out infinite reverse; }.lotus { right:2%; bottom:19%; color:#c14e68; font-size:5rem; opacity:.27; transform:translate3d(0,calc(var(--scroll-shift) * -.3),0); animation:float 5.5s ease-in-out infinite; }.om-symbol { top:40%; right:12%; color:rgba(104,21,42,.16); font-family:var(--font-heading); font-size:7rem; transform:translate3d(0,calc(var(--scroll-shift) * .18),0); }.nadaswaram { top:65%; right:-40px; width:210px; height:32px; border:8px solid rgba(143,89,30,.38); border-left-width:14px; border-radius:50% 15% 15% 50%; transform:translate3d(0,calc(var(--scroll-shift) * .42),0) rotate(-18deg); }.nadaswaram::after { content:''; position:absolute; right:-28px; top:-15px; width:37px; height:47px; border-radius:50% 50% 45% 45%; background:rgba(168,109,34,.38); }.nadaswaram i { position:absolute; inset:-4px 35px; border-left:4px dotted rgba(88,47,11,.42); border-right:4px dotted rgba(88,47,11,.42); }
  @keyframes float { 50% { margin-top:-12px; } } @keyframes thaliTurn { to { rotate:360deg; } }
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
    background: rgba(255, 252, 243, .76);
    backdrop-filter: blur(8px);
    padding: 3rem 2rem;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(72,20,32,.09);
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
    .couple-cards { flex-direction: column; }.joining { margin:-.6rem auto; }.thali { width:130px; height:130px; left:-52px; }.nadaswaram { scale:.72; right:-68px; }.om-symbol { font-size:5rem; right:4%; }.diya { font-size:2.4rem; }.manjal,.lotus { font-size:3.4rem; }
  }
  @media (prefers-reduced-motion: reduce) { .about-ornaments span { animation:none; transform:none; } }
</style>
