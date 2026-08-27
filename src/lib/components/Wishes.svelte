<script>
  let { wishes } = $props();
  
  let showModal = $state(false);
  let isSubmitting = $state(false);
  let previewUrl = $state('');
  
  let name = $state('');
  let relation = $state('');
  let message = $state('');
  let imageFile = $state(null);
  
  let localWishes = $state(wishes);

  $effect(() => {
    localWishes = wishes;
  });

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      imageFile = file;
      previewUrl = URL.createObjectURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !relation || !imageFile) return;

    isSubmitting = true;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('relation', relation);
    formData.append('message', message);
    formData.append('image', imageFile);

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.success) {
        // Since we combined DB wishes with data.json, we can just insert at index 0
        // Or if data.wish is returned, we can format it and insert.
        // The endpoint returns { success: true, wish: newWish }
        const formattedNewWish = {
          id: data.wish.id,
          name: data.wish.name,
          relation: data.wish.relation,
          message: data.wish.message,
          image: data.wish.imageUrl
        };
        localWishes = [formattedNewWish, ...localWishes];
        closeModal();
      } else {
        alert(data.error || 'Failed to submit wish');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      isSubmitting = false;
    }
  }

  function closeModal() {
    showModal = false;
    name = '';
    relation = '';
    message = '';
    imageFile = null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = '';
  }
</script>

<section class="wishes" id="wishes">
  <div class="container">
    <div class="section-header">
      <h2>Best Wishes</h2>
      <div class="divider"></div>
      <p class="subtitle">With love from our dearest ones</p>
      <button class="add-wish-btn" onclick={() => showModal = true}>
        Add Your Wish
      </button>
    </div>
    <div class="wishes-grid">
      {#each localWishes as wish}
        <div class="wish-card">
          <div class="img-container">
            <img src={wish.image} alt={wish.name} loading="lazy" />
          </div>
          <div class="wish-content">
            <h4>{wish.name}</h4>
            {#if wish.relation}
              <p class="relation">{wish.relation}</p>
            {/if}
            {#if wish.message}
              <p class="message">"{wish.message}"</p>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

{#if showModal}
  <div class="modal-overlay" onclick={closeModal}>
    <div class="modal-content" onclick={(e) => e.stopPropagation()}>
      <button class="close-btn" onclick={closeModal}>&times;</button>
      <h3>Share Your Wishes</h3>
      
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" bind:value={name} required placeholder="John & Jane" />
        </div>
        
        <div class="form-group">
          <label for="relation">Relation to Couple</label>
          <input type="text" id="relation" bind:value={relation} required placeholder="Friend of Bride" />
        </div>
        
        <div class="form-group">
          <label for="message">Message (Optional)</label>
          <textarea id="message" bind:value={message} rows="3" placeholder="Wishing you a lifetime of joy!"></textarea>
        </div>
        
        <div class="form-group">
          <label for="image">Upload a Photo</label>
          <div class="file-upload">
            <input type="file" id="image" accept="image/*" onchange={handleImageChange} required />
            {#if previewUrl}
              <div class="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            {/if}
          </div>
        </div>
        
        <button type="submit" class="submit-btn" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Wish'}
        </button>
      </form>
    </div>
  </div>
{/if}

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
    margin: 0 0 0.5rem 0;
    font-size: 1.4rem;
    color: var(--color-accent);
  }
  .wish-content .relation {
    font-size: 0.9rem;
    color: var(--color-primary);
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  .wish-content .message {
    font-size: 0.95rem;
    color: var(--color-text);
    font-style: italic;
    line-height: 1.4;
  }
  .add-wish-btn {
    margin-top: 1.5rem;
    padding: 0.8rem 2rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1.1rem;
    cursor: pointer;
    font-family: var(--font-heading);
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  }
  .add-wish-btn:hover {
    transform: translateY(-2px);
    background: var(--color-accent);
    box-shadow: 0 6px 20px rgba(139, 0, 0, 0.4);
  }
  
  /* Modal Styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content {
    background: var(--color-bg);
    padding: 2.5rem;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1.5rem;
    background: none;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    color: var(--color-text-light);
    transition: color 0.2s;
  }
  .close-btn:hover {
    color: var(--color-accent);
  }
  .modal-content h3 {
    text-align: center;
    color: var(--color-accent);
    margin-bottom: 2rem;
    font-size: 2rem;
    font-family: var(--font-heading);
  }
  .form-group {
    margin-bottom: 1.5rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--color-text);
    font-weight: 500;
  }
  .form-group input[type="text"],
  .form-group textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
    font-size: 1rem;
    background: #fafafa;
    transition: all 0.3s;
  }
  .form-group input[type="text"]:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
    background: white;
  }
  .file-upload {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .file-upload input[type="file"] {
    padding: 0.5rem;
    border: 1px dashed #ccc;
    border-radius: 8px;
    background: #fafafa;
    cursor: pointer;
  }
  .image-preview {
    width: 100%;
    height: 200px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid var(--color-primary);
  }
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    font-family: var(--font-heading);
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
</style>
