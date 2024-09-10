<script>
  import '../app.css';
  import Modal from '../shared/Modal.svelte'; // Import the Modal component
  import FilterSection from '../shared/FilterSection.svelte'; // Import the FilterSection component
  import CompareSection from '../shared/CompareSection.svelte'; // Import the CompareSection component
  import { onMount } from 'svelte';
  import { paddlesStore } from '../stores.js'; // Import the store

  let showModal = false;
  let showFilters = false;
  let showCompare = false;
  let powerFilter = 0;
  let spinFilter = 0;
  let popFilter = 0;
  let twistFilter = 0;
  let balanceFilter = 0;
  let swingFilter = 0;
  let paddles = [];

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function toggleFilters() {
    showFilters = !showFilters;
    if (showFilters) {
      showCompare = false;
    }
  }

  function toggleCompare() {
    showCompare = !showCompare;
    if (showCompare) {
      showFilters = false;
    }
  }

  function setPowerFilter(event) {
    powerFilter = event.target.value;
  }

  function setSpinFilter(event) {
    spinFilter = event.target.value;
  }

  function setPopFilter(event) {
    popFilter = event.target.value;
  }

  function setTwistFilter(event) {
    twistFilter = event.target.value;
  }

  function setBalanceFilter(event) {
    balanceFilter = event.target.value;
  }

  function setSwingFilter(event) {
    swingFilter = event.target.value;
  }

  // Subscribe to the paddles store
  paddlesStore.subscribe(value => {
    paddles = value;
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
  <div class="icon-bar">
    <button class="icon-button" on:click={toggleFilters} aria-label="Toggle filters">
      <i class="fas fa-filter"></i>
    </button>
    <button class="icon-button" on:click={toggleCompare} aria-label="Toggle compare">
      <i class="fas fa-exchange-alt"></i> <!-- New icon for comparing paddles -->
    </button>
  </div>
  {#if showFilters}
    <FilterSection 
      {powerFilter} {spinFilter} {popFilter} {twistFilter} {balanceFilter} {swingFilter}
      setPowerFilter={setPowerFilter}
      setSpinFilter={setSpinFilter}
      setPopFilter={setPopFilter}
      setTwistFilter={setTwistFilter}
      setBalanceFilter={setBalanceFilter}
      setSwingFilter={setSwingFilter}
    />
  {/if}
  {#if showCompare}
    <CompareSection {paddles} />
  {/if}
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
    background: linear-gradient(90deg, #03c8ff, #0077ff);
    color: white;
    padding: 15px 20px; /* Increase padding for better height */
    text-align: center;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0px;
    border-radius: 4px;
    font-size: 1.2em;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .banner h3 {
    flex: 1;
    text-align: center;
    margin: 0;
  }

  .info-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    color: white;
    position: absolute;
    right: 20px; /* Adjust spacing from the right */
    top: 50%; /* Center vertically */
    transform: translateY(-50%); /* Center vertically */
  }

  .icon-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    padding: 5px 0;
    border-color: #333;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    color: white;
    margin: 0 10px;
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