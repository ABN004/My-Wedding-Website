<script>
  let { wishes } = $props();
  
  let showModal = $state(false);
  let isSubmitting = $state(false);
  let previewUrl = $state('');
  
  let name = $state('');
  let relation = $state('');
  let message = $state('');
  /** @type {File | null} */
  let imageFile = $state(null);
  /** @type {HTMLInputElement} */
  let imageInput;
  let cropperOpen = $state(false);
  let cropSourceUrl = $state('');
  /** @type {HTMLDivElement} */
  let cropViewport;
  let cropImageWidth = $state(0);
  let cropImageHeight = $state(0);
  let cropScale = $state(1);
  let cropBaseScale = $state(1);
  let cropX = $state(0);
  let cropY = $state(0);
  /** @type {{ x: number; y: number; cropX: number; cropY: number } | null} */
  let dragStart = null;
  
  let localWishes = $state(wishes);

  $effect(() => {
    localWishes = wishes;
  });

  /** @param {Event} e */
  function handleImageChange(e) {
    const file = /** @type {HTMLInputElement} */ (e.currentTarget).files?.[0];
    if (file) {
      if (cropSourceUrl) URL.revokeObjectURL(cropSourceUrl);
      cropImageWidth = 0;
      cropImageHeight = 0;
      cropScale = 1;
      cropX = 0;
      cropY = 0;
      cropSourceUrl = URL.createObjectURL(file);
      cropperOpen = true;
    }
  }

  function initialiseCropper() {
    if (!cropViewport || !cropImageWidth || !cropImageHeight) return;
    cropBaseScale = Math.max(cropViewport.clientWidth / cropImageWidth, cropViewport.clientHeight / cropImageHeight);
    cropScale = 1;
    const width = cropImageWidth * cropBaseScale;
    const height = cropImageHeight * cropBaseScale;
    cropX = (cropViewport.clientWidth - width) / 2;
    cropY = (cropViewport.clientHeight - height) / 2;
  }

  /** @param {Event} e */
  function cropImageLoaded(e) {
    const image = /** @type {HTMLImageElement} */ (e.currentTarget);
    cropImageWidth = image.naturalWidth;
    cropImageHeight = image.naturalHeight;
    requestAnimationFrame(initialiseCropper);
  }

  /** @param {number} x @param {number} y */
  function constrainCrop(x, y) {
    const scale = cropBaseScale * cropScale;
    const width = cropImageWidth * scale;
    const height = cropImageHeight * scale;
    return {
      x: Math.min(0, Math.max(cropViewport.clientWidth - width, x)),
      y: Math.min(0, Math.max(cropViewport.clientHeight - height, y))
    };
  }

  /** @param {PointerEvent} e */
  function startDragging(e) {
    dragStart = { x: e.clientX, y: e.clientY, cropX, cropY };
    cropViewport.setPointerCapture(e.pointerId);
  }

  /** @param {PointerEvent} e */
  function dragCrop(e) {
    if (!dragStart) return;
    const position = constrainCrop(dragStart.cropX + e.clientX - dragStart.x, dragStart.cropY + e.clientY - dragStart.y);
    cropX = position.x;
    cropY = position.y;
  }

  function stopDragging() { dragStart = null; }

  /** @param {Event} e */
  function updateZoom(e) {
    const nextZoom = Number(/** @type {HTMLInputElement} */ (e.currentTarget).value);
    const oldWidth = cropImageWidth * cropBaseScale * cropScale;
    const oldHeight = cropImageHeight * cropBaseScale * cropScale;
    const centerX = (cropViewport.clientWidth / 2 - cropX) / oldWidth;
    const centerY = (cropViewport.clientHeight / 2 - cropY) / oldHeight;
    cropScale = nextZoom;
    const newWidth = cropImageWidth * cropBaseScale * cropScale;
    const newHeight = cropImageHeight * cropBaseScale * cropScale;
    const position = constrainCrop(cropViewport.clientWidth / 2 - centerX * newWidth, cropViewport.clientHeight / 2 - centerY * newHeight);
    cropX = position.x;
    cropY = position.y;
  }

  /** @param {HTMLCanvasElement} canvas @returns {Promise<Blob | null>} */
  function canvasToJpeg(canvas) {
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  }

  async function applyCrop() {
    const image = new Image();
    image.src = cropSourceUrl;
    try {
      await image.decode();
    } catch {
      imageFile = null;
      alert('We could not process this image. Please choose another photo.');
      cancelCrop();
      return;
    }
    const displayedWidth = cropImageWidth * cropBaseScale * cropScale;
    const displayedHeight = cropImageHeight * cropBaseScale * cropScale;
    const sourceX = Math.max(0, (-cropX / displayedWidth) * cropImageWidth);
    const sourceY = Math.max(0, (-cropY / displayedHeight) * cropImageHeight);
    const sourceWidth = (cropViewport.clientWidth / displayedWidth) * cropImageWidth;
    const sourceHeight = (cropViewport.clientHeight / displayedHeight) * cropImageHeight;
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const context = canvas.getContext('2d');
    context?.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    const blob = await canvasToJpeg(canvas);
    if (!blob) return;
    const croppedFile = new File([blob], 'wedding-wish.jpg', { type: 'image/jpeg' });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    imageFile = croppedFile;
    previewUrl = URL.createObjectURL(croppedFile);
    URL.revokeObjectURL(cropSourceUrl);
    cropSourceUrl = '';
    cropperOpen = false;
  }

  function cancelCrop() {
    if (cropSourceUrl) URL.revokeObjectURL(cropSourceUrl);
    cropSourceUrl = '';
    cropperOpen = false;
    if (imageInput) imageInput.value = '';
  }

  /** @param {SubmitEvent} e */
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

  /** @param {MouseEvent} e */
  function stopModalClick(e) { e.stopPropagation(); }
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
    <div class="modal-content" onclick={stopModalClick}>
      <button class="close-btn" onclick={closeModal} disabled={isSubmitting}>&times;</button>
      <h3>Share Your Wishes</h3>
      
      <form onsubmit={handleSubmit}>
        <div class="form-group">
          <label for="name">Your Name</label>
          <input type="text" id="name" bind:value={name} required placeholder="John & Jane" disabled={isSubmitting} />
        </div>
        
        <div class="form-group">
          <label for="relation">Relation to Couple</label>
          <input type="text" id="relation" bind:value={relation} required placeholder="Friend of Bride" disabled={isSubmitting} />
        </div>
        
        <div class="form-group">
          <label for="message">Message (Optional)</label>
          <textarea id="message" bind:value={message} rows="3" placeholder="Wishing you a lifetime of joy!" disabled={isSubmitting}></textarea>
        </div>
        
        <div class="form-group">
          <label for="image">Upload a Photo</label>
          <div class="file-upload">
            <input bind:this={imageInput} type="file" id="image" accept="image/*" onchange={handleImageChange} required disabled={isSubmitting} />
            {#if previewUrl}
              <div class="image-preview">
                <img src={previewUrl} alt="Preview" />
              </div>
            {/if}
          </div>
        </div>
        
        <button type="submit" class="submit-btn" disabled={isSubmitting}>
          Send Wish
        </button>
      </form>

      {#if isSubmitting}
        <div class="submitting-overlay">
          <img src="/images/Loader_Logo.png" alt="Uploading" class="pulse-logo" />
          <p>Sending your beautiful wish...</p>
        </div>
      {/if}
    </div>
  </div>
{/if}

{#if cropperOpen}
  <div class="cropper-overlay" role="dialog" aria-modal="true" aria-label="Crop your photo">
    <div class="cropper-panel">
      <div class="cropper-heading"><div><p>Make it yours</p><h3>Crop your photo</h3></div><button type="button" class="crop-cancel-icon" onclick={cancelCrop} aria-label="Cancel crop">×</button></div>
      <div class="crop-viewport" bind:this={cropViewport} onpointerdown={startDragging} onpointermove={dragCrop} onpointerup={stopDragging} onpointercancel={stopDragging}>
        <img class="crop-source" src={cropSourceUrl} alt="Photo being cropped" onload={cropImageLoaded} draggable="false" style={`left:${cropX}px;top:${cropY}px;width:${cropImageWidth * cropBaseScale * cropScale}px`} />
        <div class="crop-grid" aria-hidden="true"></div>
      </div>
      <label class="zoom-control"><span>−</span><input type="range" min="1" max="2.8" step="0.01" value={cropScale} oninput={updateZoom} aria-label="Zoom photo" /><span>＋</span></label>
      <p class="crop-help">Drag to position your photo · pinch-style zoom control</p>
      <div class="crop-actions"><button type="button" class="crop-cancel" onclick={cancelCrop}>Cancel</button><button type="button" class="crop-apply" onclick={applyCrop}>Use this photo</button></div>
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
    inset: 0;
    width: 100%;
    height: 100dvh;
    padding: 1rem;
    overflow: hidden;
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
    max-height: calc(100dvh - 2rem);
    overflow: hidden;
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
    height: 120px;
    width: auto;
    aspect-ratio: 4 / 3;
    align-self: center;
    max-width: 100%;
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
  
  /* Submitting Overlay */
  .submitting-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
    text-align: center;
  }
  .pulse-logo {
    width: 120px;
    height: auto;
    animation: pulse 2s infinite ease-in-out;
    margin-bottom: 1.5rem;
  }
  .submitting-overlay p {
    color: var(--color-accent);
    font-size: 1.2rem;
    font-family: var(--font-heading);
    font-style: italic;
    margin: 0;
  }
  @keyframes pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.05); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  @media (max-width: 600px) {
    .modal-overlay { padding: 0.5rem; align-items: center; }
    .modal-content {
      width: 100%;
      max-height: calc(100dvh - 1rem);
      padding: 1rem 1.1rem;
      border-radius: 12px;
    }
    .close-btn { top: 0.35rem; right: 0.85rem; font-size: 1.65rem; }
    .modal-content h3 { margin: 0 1.5rem 0.85rem 0; font-size: 1.65rem; }
    .form-group { margin-bottom: 0.55rem; }
    .form-group label { margin-bottom: 0.2rem; font-size: 0.82rem; }
    .form-group input[type="text"],
    .form-group textarea { padding: 0.5rem 0.7rem; font-size: 0.88rem; }
    .form-group textarea { height: 48px; min-height: 48px; resize: none; }
    .file-upload { gap: 0.4rem; }
    .file-upload input[type="file"] { padding: 0.32rem; font-size: 0.76rem; }
    .image-preview { height: 64px; border-width: 1px; }
    .submit-btn { padding: 0.58rem; font-size: 1rem; }
  }
  @media (max-height: 560px) and (max-width: 600px) {
    .modal-content { padding-top: 0.7rem; padding-bottom: 0.7rem; }
    .modal-content h3 { margin-bottom: 0.5rem; font-size: 1.4rem; }
    .form-group { margin-bottom: 0.35rem; }
    .form-group label { display: none; }
    .image-preview { height: 46px; }
    .form-group textarea { height: 38px; min-height: 38px; }
  }
  .cropper-overlay { position: fixed; inset: 0; z-index: 1100; display: grid; place-items: center; padding: 1rem; background: rgba(32, 3, 12, .82); backdrop-filter: blur(10px); }
  .cropper-panel { width: min(100%, 480px); padding: 1.15rem; border: 1px solid rgba(234, 191, 89, .45); border-radius: 18px; background: #fff9ed; box-shadow: 0 24px 80px rgba(0,0,0,.35); }
  .cropper-heading { display: flex; align-items: center; justify-content: space-between; margin-bottom: .8rem; }.cropper-heading p { margin: 0 0 .05rem; color: var(--saffron); text-transform: uppercase; letter-spacing: .13em; font-size: .62rem; font-weight: 700; }.cropper-heading h3 { margin: 0; color: var(--maroon); font-size: 1.7rem; }.crop-cancel-icon { border: 0; background: transparent; color: var(--muted); font-size: 2rem; line-height: 1; cursor: pointer; }
  .crop-viewport { position: relative; width: 100%; aspect-ratio: 4 / 3; overflow: hidden; background: #32101a; touch-action: none; user-select: none; cursor: grab; }.crop-viewport:active { cursor: grabbing; }.crop-source { position: absolute; max-width: none; height: auto; pointer-events: none; }.crop-grid { position: absolute; inset: 0; pointer-events: none; border: 1px solid rgba(255,255,255,.8); background: linear-gradient(to right, transparent 33%, rgba(255,255,255,.42) 33.4%, transparent 33.8%, transparent 66%, rgba(255,255,255,.42) 66.4%, transparent 66.8%), linear-gradient(to bottom, transparent 33%, rgba(255,255,255,.42) 33.4%, transparent 33.8%, transparent 66%, rgba(255,255,255,.42) 66.4%, transparent 66.8%); box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); }
  .zoom-control { display: flex; align-items: center; gap: .6rem; margin: 1rem .15rem .55rem; color: var(--maroon); font-size: 1.15rem; }.zoom-control input { flex: 1; accent-color: var(--maroon); }.crop-help { margin: 0; text-align: center; color: var(--muted); font-size: .73rem; }.crop-actions { display: flex; gap: .65rem; margin-top: 1rem; }.crop-actions button { flex: 1; border-radius: 99px; padding: .75rem 1rem; font-weight: 700; cursor: pointer; }.crop-cancel { border: 1px solid rgba(104,21,42,.3); color: var(--maroon); background: transparent; }.crop-apply { border: 1px solid var(--maroon); color: #fff; background: var(--maroon); }
  @media (max-width: 600px) { .cropper-overlay { padding: .6rem; }.cropper-panel { padding: .9rem; border-radius: 14px; }.cropper-heading h3 { font-size: 1.45rem; }.crop-viewport { max-height: 55dvh; }.crop-actions button { padding: .65rem .7rem; }.zoom-control { margin-top: .75rem; } }
</style>
