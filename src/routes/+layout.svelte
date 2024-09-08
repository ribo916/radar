<script>
  import '../app.css';
  import Modal from '../shared/Modal.svelte'; // Import the Modal component
  import { onMount } from 'svelte';

  let showModal = false;
  let totalValidPaddles = 0;
  let powerFilter = 0;
  let spinFilter = 0;
  let popFilter = 0;
  let twistFilter = 0;
  let balanceFilter = 0;
  let swingFilter = 0;

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  // Fetch the total number of valid paddles from the parent component
  onMount(() => {
    window.addEventListener('getTotalValidPaddles', (event) => {
      event.detail.callback(totalValidPaddles);
    });

    window.addEventListener('updateFilteredPaddlesCount', (event) => {
      totalValidPaddles = event.detail.count;
    });
  });

  // Dispatch the filter values to the child components
  $: if (typeof window !== 'undefined') {
    const event = new CustomEvent('setFilters', {
      detail: {
        powerFilter,
        spinFilter,
        popFilter,
        twistFilter,
        balanceFilter,
        swingFilter
      }
    });
    window.dispatchEvent(event);
  }
</script>

<main>
  <div class="banner">
    <h3>Paddle Comparisons</h3>
    <button class="info-button" on:click={openModal} aria-label="More information">
      <i class="fas fa-info-circle"></i>
    </button>
  </div>
  <div class="filter-area">
    <div class="filter-text">Total Valid Paddles: {totalValidPaddles}</div>
    <div class="slider-container">
      <label class="filter-label" for="powerFilter">Power:</label>
      <input id="powerFilter" type="range" min="0" max="100" bind:value={powerFilter} class="slider" />
      <div class="filter-value">{powerFilter}</div>
    </div>
    <div class="slider-container">
      <label class="filter-label" for="spinFilter">Spin:</label>
      <input id="spinFilter" type="range" min="0" max="100" bind:value={spinFilter} class="slider" />
      <div class="filter-value">{spinFilter}</div>
    </div>
    <div class="slider-container">
      <label class="filter-label" for="popFilter">Pop:</label>
      <input id="popFilter" type="range" min="0" max="100" bind:value={popFilter} class="slider" />
      <div class="filter-value">{popFilter}</div>
    </div>
    <div class="slider-container">
      <label class="filter-label" for="twistFilter">Twist:</label>
      <input id="twistFilter" type="range" min="0" max="100" bind:value={twistFilter} class="slider" />
      <div class="filter-value">{twistFilter}</div>
    </div>
    <div class="slider-container">
      <label class="filter-label" for="balanceFilter">Balance:</label>
      <input id="balanceFilter" type="range" min="0" max="100" bind:value={balanceFilter} class="slider" />
      <div class="filter-value">{balanceFilter}</div>
    </div>
    <div class="slider-container">
      <label class="filter-label" for="swingFilter">Swing:</label>
      <input id="swingFilter" type="range" min="0" max="100" bind:value={swingFilter} class="slider" />
      <div class="filter-value">{swingFilter}</div>
    </div>
  </div>
  <div class="chart-grid">
    <slot />
  </div>
</main>

{#if showModal}
  <Modal on:close={closeModal}>
    <h2>Overview</h2>
    <p>This site merely uses the JohnKew database to regenerate radar charts for quick/easy comparisons.</p>
    <ul>
      <li>Data is hardcoded from JohnKew's site on 9/3/24</li>
    </ul>
  </Modal>
{/if}

<style>
  main {
    width: 100%;
    height: 100%;
  }

  .banner {
    width: 100%;
    background: linear-gradient(90deg, #03c8ff, #0077ff);
    color: white;
    padding: 1px;
    text-align: center;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 10px;
    border-radius: 4px;
    font-size: 1.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .info-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
    color: #ccc;
    position: absolute;
    right: 20px; /* Increased spacing from the right */
  }

  .filter-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    background-color: #f0f0f0;
    color: #333;
    font-size: 1em;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  .filter-text {
    font-size: 1em;
    color: #333;
    margin-bottom: 10px;
  }

  .slider-container {
    display: flex;
    align-items: center;
    margin: 5px 0;
    width: 100%;
    max-width: 600px;
  }

  .filter-label {
    flex: 1;
    text-align: right;
    margin-right: 10px;
  }

  .slider {
    flex: 3;
  }

  .filter-value {
    flex: 1;
    text-align: left;
    margin-left: 10px;
  }

  .chart-grid {
    display: grid;
    gap: 16px; /* Adjust the gap between charts as needed */
    grid-template-columns: repeat(1, 1fr); /* Default to 1 column */
  }

  @media (min-width: 600px) {
    .chart-grid {
      grid-template-columns: repeat(2, 1fr); /* 2 columns for small screens */
    }
  }

  @media (min-width: 900px) {
    .chart-grid {
      grid-template-columns: repeat(3, 1fr); /* 3 columns for medium screens */
    }
  }

  @media (min-width: 1200px) {
    .chart-grid {
      grid-template-columns: repeat(4, 1fr); /* 4 columns for large screens */
    }
  }
</style>