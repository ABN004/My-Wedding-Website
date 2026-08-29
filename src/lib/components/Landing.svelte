<script>
  let { data } = $props();
  /** @type {Array<{ id: number; left: string; delay: string; spin: string; color: string; size: string; drift: string }>} */
  let petals = $state([]);
  let celebration = $state(false);
  /** @type {HTMLAudioElement} */
  let blessingAudio;
  let animationDone = false;
  let musicDone = false;

  function finishIfComplete() {
    if (animationDone && musicDone) celebration = false;
  }

  function completeAnimation() {
    animationDone = true;
    finishIfComplete();
  }

  function completeMusic() {
    musicDone = true;
    finishIfComplete();
  }

  const petalColors = ['#a9102c', '#d43562', '#f0c52d', '#fff8e8'];

  /** @param {number} count @param {number} wave */
  function makePetals(count, wave) {
    return Array.from({ length: count }, (_, index) => ({
      id: wave * 100 + index,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.85}s`,
      spin: `${Math.random() * 300 - 150}deg`,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      size: `${5 + Math.random() * 5}px`,
      drift: `${-115 + Math.random() * 230}px`
    }));
  }

  function shower() {
    if (celebration) return;
    celebration = true;
    animationDone = false;
    musicDone = false;
    petals = makePetals(62, 1);
    blessingAudio.currentTime = 0;
    blessingAudio.play().catch(completeMusic);
    setTimeout(() => { petals = [...petals, ...makePetals(62, 2)]; }, 1400);
    setTimeout(completeAnimation, 6000);
  }
</script>

<section class="landing" id="home">
  <audio bind:this={blessingAudio} src="/blessing.mp3" preload="metadata" onended={completeMusic} onerror={completeMusic}></audio>
  <div class="pattern" aria-hidden="true"></div><div class="image-wrapper"><img src="/images/Couple_Image.png" alt="Amal and Greeshma" /><div class="overlay"></div></div>
  {#if celebration}<div class="petal-shower" aria-hidden="true">{#each petals as petal}<i style={`left:${petal.left};animation-delay:${petal.delay};--spin:${petal.spin};--petal-color:${petal.color};--petal-size:${petal.size};--drift:${petal.drift}`}></i>{/each}</div>{/if}
  <div class="landing-content"><p class="eyebrow"><span>✦</span> With the blessings of our families <span>✦</span></p><div class="arch"><span>ॐ</span></div><div class="names"><h1>{data.groom.name}</h1><span class="ampersand">&amp;</span><h1>{data.bride.name}</h1></div><p class="date">Joyfully invite you to celebrate their union</p><div class="hero-actions"><a href="#events" class="btn">View the festivities <b>↓</b></a><button class="celebrate" onclick={shower} disabled={celebration} aria-label="Send flower petals">❀</button></div><p class="tap-hint">{celebration ? 'Blessings are in the air…' : 'Tap the flower for a shower of blessings'}</p></div>
  <div class="rangoli rangoli-left" aria-hidden="true">✺</div><div class="rangoli rangoli-right" aria-hidden="true">✺</div>
</section>

<style>
  .landing{min-height:100svh;position:relative;display:grid;place-items:center;overflow:hidden;color:#fff8e8;isolation:isolate}.image-wrapper,.image-wrapper img,.overlay{position:absolute;inset:0;width:100%;height:100%}.image-wrapper{z-index:-2}.image-wrapper img{object-fit:cover;object-position:center 32%;filter:saturate(.85) contrast(1.04)}.overlay{background:linear-gradient(90deg,rgba(48,5,19,.79),rgba(90,14,35,.33) 52%,rgba(30,2,10,.63)),linear-gradient(0deg,rgba(28,1,9,.55),transparent 55%)}.pattern{position:absolute;inset:0;z-index:-1;opacity:.28;background-image:radial-gradient(circle at 0 0,transparent 8px,rgba(234,191,89,.8) 8px 9px,transparent 9px);background-size:32px 32px;mask-image:linear-gradient(to right,#000,transparent 28%,transparent 72%,#000)}.landing-content{position:relative;text-align:center;padding:7rem 1.5rem 2rem;max-width:900px;animation:rise 1.2s .15s both}.eyebrow{font-size:.68rem;letter-spacing:.22em;text-transform:uppercase;margin:0 0 1.1rem;font-weight:600}.eyebrow span{color:var(--gold);padding:0 .5rem}.arch{width:80px;height:43px;border:1px solid var(--gold);border-bottom:0;border-radius:80px 80px 0 0;margin:auto;display:grid;place-items:center;color:var(--gold);font-size:1.55rem;box-shadow:0 -7px 0 -6px rgba(234,191,89,.8)}.names{display:flex;justify-content:center;align-items:center;gap:1.4rem;margin:1rem 0 .4rem}.names h1{font-size:clamp(3.2rem,8vw,6.7rem);line-height:.76;letter-spacing:-.045em;margin:0;text-shadow:0 4px 18px rgba(29,0,8,.34)}.ampersand{font-family:var(--font-heading);font-size:clamp(2.6rem,5vw,4.2rem);font-style:italic;color:var(--gold)}.date{font-family:var(--font-heading);font-size:clamp(1.1rem,2vw,1.45rem);font-style:italic;letter-spacing:.04em;margin:1.5rem 0}.hero-actions{display:flex;justify-content:center;align-items:center;gap:1rem}.btn{padding:.85rem 1.35rem;border:1px solid var(--gold);color:#fff9eb;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;transition:var(--transition-smooth);background:rgba(77,10,29,.25)}.btn b{color:var(--gold);margin-left:.65rem;font-size:1.1rem}.btn:hover{color:var(--maroon-deep);background:var(--gold);transform:translateY(-3px)}.celebrate{border:1px solid var(--gold);width:43px;height:43px;border-radius:50%;background:rgba(71,8,26,.5);color:var(--gold);font-size:1.25rem;cursor:pointer;transition:var(--transition-smooth)}.celebrate:hover:not(:disabled){background:var(--gold);color:var(--maroon);transform:rotate(28deg) scale(1.1)}.celebrate:disabled{cursor:wait;opacity:.55;animation:turn 2s linear infinite}.tap-hint{margin:.7rem 0 0;opacity:.75;font-size:.67rem;letter-spacing:.08em}.rangoli{position:absolute;bottom:-2.5rem;color:var(--gold);font-size:10rem;opacity:.55;animation:turn 28s linear infinite}.rangoli-left{left:-2rem}.rangoli-right{right:-2rem;animation-direction:reverse}.petal-shower{position:absolute;inset:0;pointer-events:none;overflow:hidden}.petal-shower i{position:absolute;top:-25px;width:var(--petal-size);height:calc(var(--petal-size) * 1.3);border-radius:58% 42% 68% 32%/62% 46% 54% 38%;background:radial-gradient(ellipse at 30% 22%,rgba(255,255,255,.8) 0 5%,transparent 27%),linear-gradient(145deg,rgba(255,255,255,.28),transparent 48%),var(--petal-color);animation:fall 4.05s cubic-bezier(.2,.64,.42,1) both;transform:rotate(var(--spin));box-shadow:inset -1px -1px 1px rgba(69,0,14,.2),0 1px 3px rgba(51,0,9,.17)}.petal-shower i::after{content:'';position:absolute;inset:18% 48% 10%;width:1px;background:rgba(91,10,25,.28);transform:rotate(17deg);border-radius:100%}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@keyframes turn{to{transform:rotate(360deg)}}@keyframes fall{to{top:112%;transform:translateX(var(--drift)) rotate(calc(var(--spin) + 650deg));opacity:0}}@media(max-width:600px){.names{gap:.8rem;flex-wrap:wrap}.ampersand{width:100%;line-height:.4}.names h1{font-size:3.6rem}.rangoli{font-size:7rem}}
</style>
