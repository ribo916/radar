<script>
  import '../app.css';
  import Modal from '../shared/Modal.svelte'; // Import the Modal component
  import FilterSection from '../shared/FilterSection.svelte'; // Import the FilterSection component
  import { onMount } from 'svelte';
  import data from './_data/radarScores.csv'; // Import the data

  let showModal = false;
  let showFilters = false;
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

  function toggleFilters() {
    showFilters = !showFilters;
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

  function calculateTotalValidPaddles() {
    // Assuming `data` is an array of paddle objects
    const validPaddles = data.filter((d) => {
      return Object.values(d).every(value => value !== undefined && value !== '' && !isNaN(+value) && +value > 0);
    });
    return validPaddles.length;
  }

  // Fetch the total number of valid paddles from the parent component
  onMount(() => {
    totalValidPaddles = calculateTotalValidPaddles();

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
    <button class="filter-button" on:click={toggleFilters} aria-label="Toggle filters">
      <i class="fas fa-filter"></i>
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
  <div class="filter-text">Total Valid Paddles: {totalValidPaddles}</div>
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

  .info-button, .filter-button {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2em;
    color: #ccc;
    position: absolute;
    right: 20px; /* Increased spacing from the right */
  }

  .filter-button {
    right: 50px; /* Adjust spacing to position next to info button */
  }

  .filter-toggle {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }

  .filter-text {
    font-size: 1em;
    color: #fff;
    text-align: center;
    margin-bottom: 10px;
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