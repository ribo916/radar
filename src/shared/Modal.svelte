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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start; /* Align items to the start of the flex container */
    justify-content: center;
    z-index: 1000; /* Ensure the modal is on top */
    padding-top: 10%; /* Add padding to move the modal content down */
  }
  .modal-content {
    background: white;
    color: black; /* Ensure text color is black */
    padding: 20px;
    border-radius: 10px;
    max-width: 90%; /* Default max-width for smaller screens */
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  .close-button {
    background: none;
    border: none;
    font-size: 1.5em;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }

  @media (min-width: 600px) {
    .modal-content {
      max-width: 80%; /* Adjust max-width for medium screens */
    }
  }

  @media (min-width: 900px) {
    .modal-content {
      max-width: 60%; /* Adjust max-width for larger screens */
    }
  }

  @media (min-width: 1200px) {
    .modal-content {
      max-width: 50%; /* Adjust max-width for extra-large screens */
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