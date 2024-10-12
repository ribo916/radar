<script>
  import '../app.css';
  import Modal from '../shared/Modal.svelte'; // Import the Modal component
  import FilterSection from '../shared/FilterSection.svelte'; // Import the FilterSection component
  import CompareSection from '../shared/CompareSection.svelte'; // Import the CompareSection component
  import { onMount } from 'svelte';
  import { paddlesStore, selectedReviewerStore, filterValues, selectedPaddlesStore, pbEffectFilterValues } from '../stores.js'; // Import the store

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
  let selectedReviewer;

  const reviewers = ['JohnKew', 'PBStudio', 'PBEffect'];

  onMount(() => {
    selectedReviewerStore.set(null);
  });

  selectedReviewerStore.subscribe(value => {
    selectedReviewer = value;
  });

  function selectReviewer(reviewer) {
    selectedReviewerStore.set(reviewer);
  }

  function openModal() {
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  function toggleFilters() {
    if (selectedReviewer !== 'PBStudio') {
      showFilters = !showFilters;
      if (showFilters) {
        showCompare = false;
      }
    }
  }

  function toggleCompare() {
    showCompare = !showCompare;
    if (showCompare) {
      showFilters = false;
    }
  }

  // Subscribe to the paddles store
  paddlesStore.subscribe(value => {
    paddles = value;
  });

  function handleReviewerSelect(event) {
    selectedReviewer = event.detail;
  }

  function clearAll() {
    // Reset compared paddles
    selectedPaddlesStore.set([]);

    // Reset filters
    if (selectedReviewer === 'JohnKew') {
      filterValues.set({
        powerFilter: 0,
        spinFilter: 0,
        popFilter: 0,
        twistFilter: 0,
        balanceFilter: 0,
        swingFilter: 0
      });
    } else if (selectedReviewer === 'PBEffect') {
      pbEffectFilterValues.set({
        powerFilter: 0
      });
    }

    // Dispatch custom events to notify FilterSection and CompareSection
    window.dispatchEvent(new CustomEvent('resetFilters'));
    window.dispatchEvent(new CustomEvent('resetCompare'));
  }

  $: {
    if (selectedReviewer === 'JohnKew') {
      filterValues.set({
        powerFilter,
        spinFilter,
        popFilter,
        twistFilter,
        balanceFilter,
        swingFilter
      });
    }
  }

  function goHome() {
    selectedReviewerStore.set(null);
  }
</script>

<main>
  <div class="banner">
    <h3>Pickleball Paddle Reviews</h3>
    <button class="info-button" on:click={openModal} aria-label="More information">
      <i class="fas fa-info-circle"></i>
    </button>
  </div>
  <div class="reviewer-bar">
    {#each reviewers as reviewer}
      <button 
        class="reviewer-button {selectedReviewer === reviewer ? 'active' : ''}" 
        on:click={() => selectReviewer(reviewer)}
      >
        {reviewer}
      </button>
    {/each}
  </div>
  {#if selectedReviewer && (selectedReviewer === 'JohnKew' || selectedReviewer === 'PBEffect')}
    <div class="icon-bar">
      <button class="icon-button" on:click={toggleFilters} aria-label="Toggle filters" title="Filter">
        <i class="fas fa-filter"></i>
      </button>
      {#if selectedReviewer === 'JohnKew'}
        <button class="icon-button" on:click={toggleCompare} aria-label="Toggle compare" title="Compare">
          <i class="fas fa-exchange-alt"></i>
        </button>
      {/if}
      <button class="icon-button" on:click={clearAll} aria-label="Clear all filters and comparisons" title="Clear">
        <i class="fas fa-undo"></i>
      </button>
    </div>
  {/if}
  {#if showFilters}
    <FilterSection />
  {/if}
  {#if showCompare && selectedReviewer === 'JohnKew'}
    <CompareSection {paddles} />
  {/if}
  <slot />
</main>

{#if showModal}
  <Modal on:close={closeModal}>
    <h2>Overview</h2>
    <p>This site displays the public spreadsheet data found on pickleball review sites for easier consumption on multiple devices.</p>
    <ul>
      <li>JohnKew site is <a href="https://www.johnkewpickleball.com/" target="_blank">here</a></li>
      <li>PBEffect site is <a href="https://pickleballeffect.com/" target="_blank">here</a></li>
      <li>PBStudio site is <a href="https://pickleballstudio.com/" target="_blank">here</a></li>
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
    padding: 5px;
  }

  @media (min-width: 640px) {
    .icon-bar {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .icon-bar {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  @media (min-width: 1440px) {
    .icon-bar {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
  }

  .reviewer-bar {
    display: flex;
    justify-content: center;
    background-color: #333;
    padding: 10px 0;
  }

  .reviewer-button {
    background: none;
    border: none;
    color: #fff;
    padding: 5px 15px;
    margin: 0 5px;
    cursor: pointer;
    font-size: 0.9em;
    transition: background-color 0.3s;
  }

  .reviewer-button.active {
    background-color: #555;
    border-radius: 5px;
  }

  .reviewer-button:hover {
    background-color: #444;
    border-radius: 5px;
  }

  .home-button {
    margin-right: auto; /* This pushes the Home button to the left */
  }
</style>
