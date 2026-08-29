<script>
  import { onMount } from 'svelte';
  let { events } = $props();
  /** @type {HTMLElement} */
  let eventSection;
  let scrollShift = $state(0);
  onMount(() => {
    /** @type {number | undefined} */
    let frame;
    const update = () => { frame = undefined; if (eventSection) scrollShift = (window.innerHeight / 2 - eventSection.getBoundingClientRect().top) * .12; };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); };
  });
</script>

<section class="events" id="events" bind:this={eventSection} style={`--scroll-shift:${scrollShift}px`}>
  <div class="event-ornaments" aria-hidden="true"><span class="kalash">◉</span><span class="coconut">🥥</span><span class="event-diya">🪔</span><span class="manjal-bowl">✦</span><span class="bells">♢ ♢ ♢</span><span class="temple">⌂</span></div>
  <div class="container">
    <div class="section-header">
      <p class="kicker">A day woven with tradition</p>
      <h2>Wedding Events</h2>
      <div class="divider"></div>
    </div>
    <div class="events-timeline">
      {#each events as event, i}
        <div class="event-card">
          {#if i === 0}
            <img class="event-prop mangalya-thali" src="/images/kerala-mangalya-thali.png" alt="Kerala wedding mangalya thali on yellow charad" />
          {:else}
            <img class="event-prop nelpara" src="/images/kerala-nelpara.png" alt="Traditional Kerala nelpara with paddy and thengin pookkula" />
          {/if}
          <div class="event-content">
            <h3>{event.name}</h3>
            <div class="event-details">
              <div class="detail-item">
                <span class="icon">✦</span>
                <span>{event.date}</span>
              </div>
              <div class="detail-item">
                <span class="icon">◷</span>
                <span>{event.time}</span>
              </div>
              <div class="detail-item">
                <span class="icon">⌖</span>
                <span>{event.location}</span>
              </div>
            </div>
            <a href={event.map_url} target="_blank" rel="noopener noreferrer" class="btn-map">View Map</a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  .events {
    position:relative;
    isolation:isolate;
    overflow:hidden;
    padding: 6rem 2rem;
    background: radial-gradient(circle at 15% 75%, rgba(231,176,55,.15), transparent 19%), radial-gradient(circle at 87% 20%, rgba(185,52,83,.12), transparent 22%), linear-gradient(135deg, #fff9ed, #fff4df);
  }
  .container {
    max-width: 1000px;
    margin: 0 auto;
    position:relative;
    z-index:2;
  }
  .event-ornaments span { position:absolute; pointer-events:none; user-select:none; }.kalash { left:3%; top:14%; display:grid; place-items:center; width:104px; height:104px; border:8px double rgba(188,135,35,.43); border-radius:40% 40% 48% 48%; color:rgba(104,21,42,.5); font-size:3rem; transform:translate3d(0,calc(var(--scroll-shift) * -.35),0) rotate(-10deg); background:radial-gradient(circle at 50% 36%, #f6d876 0 7%, transparent 8%),linear-gradient(145deg,rgba(244,204,88,.45),rgba(138,74,21,.22)); animation:float 4.8s ease-in-out infinite; }.kalash::before{content:'✦';position:absolute;top:-32px;color:#77a25a;font-size:2.5rem}.coconut { top:4%; right:4%; font-size:4rem; transform:translate3d(0,calc(var(--scroll-shift) * .28),0) rotate(13deg); filter:sepia(.2) drop-shadow(0 8px 8px rgba(80,41,5,.12)); }.event-diya { right:7%; bottom:11%; font-size:3.9rem; transform:translate3d(0,calc(var(--scroll-shift) * -.26),0) rotate(-13deg); animation:float 3.8s ease-in-out infinite; }.manjal-bowl { left:8%; bottom:20%; width:75px; height:75px; display:grid; place-items:center; border-radius:50%; color:#b16900; font-size:2.2rem; background:radial-gradient(circle, #f8db38 0 53%, #ac6715 55% 62%, transparent 64%); transform:translate3d(0,calc(var(--scroll-shift) * .3),0) rotate(20deg); }.bells { top:45%; right:4%; color:rgba(163,104,31,.32); font-size:3rem; letter-spacing:.25em; writing-mode:vertical-rl; transform:translate3d(0,calc(var(--scroll-shift) * .38),0) rotate(12deg); }.temple { left:2%; bottom:6%; color:rgba(104,21,42,.13); font-size:9rem; transform:translate3d(0,calc(var(--scroll-shift) * -.2),0); }
  @keyframes float { 50% { margin-top:-11px; } }
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
  .events-timeline {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .event-card {
    background: rgba(255, 250, 238, .74);
    backdrop-filter: blur(8px);
    width: 100%;
    max-width: 600px;
    padding: 2.5rem;
    border-radius: 2px;
    box-shadow: 0 12px 35px rgba(75, 20, 33, .08);
    border: 1px solid rgba(180, 119, 39, .25);
    transition: var(--transition-smooth);
  }
  .event-card:hover {
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }
  .event-content h3 {
    font-size: 1.8rem;
    color: var(--color-accent);
    margin-bottom: 1.5rem;
  }
  .kicker { margin:0 0 .5rem; color:var(--saffron); font-size:.68rem; text-transform:uppercase; letter-spacing:.2em; font-weight:600; }.event-card { position:relative; overflow:hidden; }.event-content { position:relative; }.icon { color:var(--saffron); width:1.2rem; text-align:center; }
  .event-prop {
    position:absolute;
    object-fit:contain;
    /*filter:drop-shadow(0 8px 8px rgba(85,39,6,.22)); */
    transition:transform .45s ease, filter .45s ease; }.mangalya-thali { right:.8rem; top:.85rem; width:138px; height:88px; transform:rotate(-5deg); }.nelpara { right:1.45rem; top:.35rem; width:82px; height:112px; transform:rotate(4deg); }.event-card:hover .mangalya-thali { transform:rotate(2deg) scale(1.08); filter:drop-shadow(0 11px 10px rgba(85,39,6,.28)); }.event-card:hover .nelpara { transform:rotate(-2deg) scale(1.08); filter:drop-shadow(0 11px 10px rgba(85,39,6,.28)); }
  .event-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  .detail-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 1.05rem;
    color: var(--color-text);
  }
  .icon {
    font-size: 1.2rem;
  }
  .btn-map {
    display: inline-block;
    padding: 0.8rem 2rem;
    background-color: var(--maroon);
    color: #fff;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 0;
    transition: var(--transition-smooth);
  }
  .btn-map:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
  }
  @media (max-width: 768px) { .kalash { scale:.7; left:-2%; }.coconut { font-size:2.8rem; }.event-diya { font-size:2.8rem; right:-1%; }.bells { font-size:2.2rem; right:-3%; }.temple { font-size:6rem; left:-4%; }.manjal-bowl { scale:.7; left:1%; } }
  @media (prefers-reduced-motion: reduce) { .event-ornaments span { animation:none; transform:none; } }
</style>
