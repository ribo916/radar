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
  import data from '../routes/_data/radarScores.csv'; // Import the data

  let totalValidPaddles = "All"; // Default value

  function calculateTotalValidPaddles(data) {
    // Assuming `data` is an array of paddle objects
    const validPaddles = data.filter((d) => {
      return Object.values(d).every(value => value !== undefined && value !== '' && !isNaN(+value) && +value > 0);
    });
    return validPaddles.length;
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
    font-size: 1em;
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
  }

  .slider {
    flex: 3;
  }

  .filter-value {
    flex: 1;
    text-align: left;
    margin-left: 10px;
  }

  .total-valid-paddles {
    font-size: 1em; /* Adjusted font size to match the filters */
    color: #fff;
    text-align: center;
    margin-top: 20px;
  }
</style>