<script>
  export let powerFilter;
  export let spinFilter;
  export let popFilter;
  export let twistFilter;
  export let balanceFilter;
  export let swingFilter;

  export let setPowerFilter;
  export let setSpinFilter;
  export let setPopFilter;
  export let setTwistFilter;
  export let setBalanceFilter;
  export let setSwingFilter;

  import { onMount } from 'svelte';
  import { paddlesStore } from '../stores.js'; // Import the store

  let totalValidPaddles = "All"; // Default value

  // Subscribe to the paddles store to get the total number of valid paddles
  paddlesStore.subscribe(value => {
    totalValidPaddles = value.length;
  });

  // Fetch the total number of valid paddles from the parent component
  onMount(() => {
    window.addEventListener('getTotalValidPaddles', (event) => {
      event.detail.callback(totalValidPaddles);
    });

    window.addEventListener('updateFilteredPaddlesCount', (event) => {
      totalValidPaddles = event.detail.count;
    });
  });
</script>

<div class="filter-area">
  <div class="slider-container">
    <label class="filter-label" for="powerFilter">Power:</label>
    <input id="powerFilter" type="range" min="0" max="100" bind:value={powerFilter} class="slider" on:input={setPowerFilter} />
    <div class="filter-value">{powerFilter}</div>
  </div>
  <div class="slider-container">
    <label class="filter-label" for="spinFilter">Spin:</label>
    <input id="spinFilter" type="range" min="0" max="100" bind:value={spinFilter} class="slider" on:input={setSpinFilter} />
    <div class="filter-value">{spinFilter}</div>
  </div>
  <div class="slider-container">
    <label class="filter-label" for="popFilter">Pop:</label>
    <input id="popFilter" type="range" min="0" max="100" bind:value={popFilter} class="slider" on:input={setPopFilter} />
    <div class="filter-value">{popFilter}</div>
  </div>
  <div class="slider-container">
    <label class="filter-label" for="twistFilter">Twist:</label>
    <input id="twistFilter" type="range" min="0" max="100" bind:value={twistFilter} class="slider" on:input={setTwistFilter} />
    <div class="filter-value">{twistFilter}</div>
  </div>
  <div class="slider-container">
    <label class="filter-label" for="balanceFilter">Balance:</label>
    <input id="balanceFilter" type="range" min="0" max="100" bind:value={balanceFilter} class="slider" on:input={setBalanceFilter} />
    <div class="filter-value">{balanceFilter}</div>
  </div>
  <div class="slider-container">
    <label class="filter-label" for="swingFilter">Swing:</label>
    <input id="swingFilter" type="range" min="0" max="100" bind:value={swingFilter} class="slider" on:input={setSwingFilter} />
    <div class="filter-value">{swingFilter}</div>
  </div>
  <!-- Total Valid Paddles Count -->
  <div class="total-valid-paddles">Total Valid Paddles: {totalValidPaddles}</div>
  <br>
</div>

<style>
  .filter-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: #fff;
    font-size: 0.75em; /* Changed from 1em to match card font size */
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-color: #333;
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
    font-size: 1em; /* This will be relative to the new base size */
  }

  .slider {
    flex: 3;
  }

  .filter-value {
    flex: 1;
    text-align: left;
    margin-left: 10px;
    font-size: 1em; /* Match the label size */
  }

  .total-valid-paddles {
    font-size: 1em; /* This will now be relative to the new base size */
    color: #fff;
    text-align: center;
    margin-top: 20px;
  }
</style>