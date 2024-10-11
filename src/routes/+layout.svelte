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
    <h3>Pickleball Paddle Charts</h3>
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
    <p>This site uses the JohnKew spreadsheet to regenerate radar charts for statistical comparison.</p>
    <ul>
      <li>Data last refreshed: 9/24/24</li>
      <li>JohnKew site is <a href="https://www.johnkewpickleball.com/" target="_blank">here</a></li>
      <li>Code is <a href="https://github.com/ribo916/radar/" target="_blank">here</a></li>
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
    padding: 15px 20px;
    text-align: center;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 0px;
    border-radius: 4px;
    font-size: 0.75em; /* Reduced from 1em to match card font size */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .banner h3 {
    flex: 1;
    text-align: center;
    margin: 0;
    font-size: 1.2em; /* Adjust this value as needed */
  }

  .info-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em; /* Reduced from 1.2em */
    color: white;
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
  }

  .icon-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    padding: 5px 0;
  }

  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1em; /* Reduced from 1.2em to match info-button */
    color: white;
    margin: 0 10px;
  }

  .chart-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 16px;
  }

  @media (min-width: 640px) {
    .chart-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .chart-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  @media (min-width: 1440px) {
    .chart-grid {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
  }
</style>
