<script>
  let { events } = $props();
</script>

<section class="events" id="events">
  <div class="container">
    <div class="section-header">
      <h2>Wedding Events</h2>
      <div class="divider"></div>
    </div>
    <div class="events-timeline">
      {#each events as event, i}
        <div class="event-card">
          <div class="event-content">
            <h3>{event.name}</h3>
            <div class="event-details">
              <div class="detail-item">
                <span class="icon">📅</span>
                <span>{event.date}</span>
              </div>
              <div class="detail-item">
                <span class="icon">⏰</span>
                <span>{event.time}</span>
              </div>
              <div class="detail-item">
                <span class="icon">📍</span>
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
    padding: 6rem 2rem;
    background-color: var(--color-bg);
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
  .events-timeline {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
  }
  .event-card {
    background: var(--color-secondary);
    width: 100%;
    max-width: 600px;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
    border-left: 4px solid var(--color-primary);
    transition: var(--transition-smooth);
  }
  .event-card:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
  }
  .event-content h3 {
    font-size: 1.8rem;
    color: var(--color-accent);
    margin-bottom: 1.5rem;
  }
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
    background-color: var(--color-primary);
    color: #fff;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 4px;
    transition: var(--transition-smooth);
  }
  .btn-map:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-2px);
  }
</style>
