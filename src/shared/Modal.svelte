<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function closeModal() {
    dispatch('close');
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 1000;
    padding-top: 10%;
  }
  .modal-content {
    background: #1a1a1a;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
    max-width: 90%;
    width: 100%;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1);
    position: relative;
    font-size: 0.75em;
    border: 1px solid #333;
  }
  .close-button {
    background: none;
    border: none;
    font-size: 1.5em;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    color: #fff;
  }

  /* Adjust heading sizes */
  :global(.modal-content h1) { font-size: 1.5em; }
  :global(.modal-content h2) { font-size: 1.3em; }
  :global(.modal-content h3) { font-size: 1.2em; }
  :global(.modal-content h4) { font-size: 1.1em; }
  :global(.modal-content h5, .modal-content h6) { font-size: 1em; }

  /* Adjust paragraph and list item sizes */
  :global(.modal-content p, .modal-content li) { font-size: 1em; }

  /* Style for links inside the modal */
  :global(.modal-content a) {
    color: #03c8ff;
    text-decoration: none;
  }

  :global(.modal-content a:hover) {
    text-decoration: underline;
  }

  @media (min-width: 600px) {
    .modal-content {
      max-width: 80%;
    }
  }

  @media (min-width: 900px) {
    .modal-content {
      max-width: 60%;
    }
  }

  @media (min-width: 1200px) {
    .modal-content {
      max-width: 50%;
    }
  }
</style>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
  class="modal"
  role="dialog"
  aria-modal="true"
  tabindex="0"
  on:click={closeModal}
  on:keydown={handleKeyDown}
>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <div class="modal-content" role="document" tabindex="0" on:click|stopPropagation on:keydown={handleKeyDown}>
    <button class="close-button" on:click={closeModal}>&times;</button>
    <slot></slot>
  </div>
</div>
