<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte';
  import { paddlesStore, filterValues, pbEffectFilterValues, selectedReviewerStore, lastKnownJohnKewFilters } from '../stores.js';

  let totalValidPaddles = "All";
  let selectedReviewer;

  selectedReviewerStore.subscribe(value => {
    selectedReviewer = value;
  });

  paddlesStore.subscribe(value => {
    totalValidPaddles = value.length;
  });

  onMount(() => {
    window.addEventListener('getTotalValidPaddles', (event) => {
      event.detail.callback(totalValidPaddles);
    });

    window.addEventListener('updateFilteredPaddlesCount', (event) => {
      totalValidPaddles = event.detail.count;
    });
  });

  afterUpdate(() => {
    $filterValues;
  });

  function resetFilters() {
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
        powerFilter: 0,
        popFilter: 0,
        twistFilter: 0,
        swingFilter: 0,
        spinFilter: 0
      });
    }
  }

  onMount(() => {
    window.addEventListener('resetFilters', resetFilters);
  });

  onDestroy(() => {
    window.removeEventListener('resetFilters', resetFilters);
  });

  function updateFilter(key, value) {
    if (selectedReviewer === 'JohnKew') {
      filterValues.update(filters => {
        const updatedFilters = { ...filters, [key]: value };
        lastKnownJohnKewFilters.set(updatedFilters);
        return updatedFilters;
      });
    } else if (selectedReviewer === 'PBEffect') {
      pbEffectFilterValues.update(filters => ({ ...filters, [key]: value }));
    }
  }

  const spinLevels = ['All', 'Low', 'Medium', 'High', 'Very High'];

  function getSpinLabel(value) {
    const index = Math.floor(value / 25);
    if (index === 0) {
      return spinLevels[index];
    } else {
      return `${spinLevels[index]} (only)`;
    }
  }
</script>

<div class="filter-area">
  {#if selectedReviewer === 'JohnKew'}
    {#each Object.entries($filterValues) as [key, value]}
      <div class="slider-container">
        <label class="filter-label" for={key}>{key.replace('Filter', '')}:</label>
        <input id={key} type="range" min="0" max="100" bind:value={$filterValues[key]} on:input={() => updateFilter(key, $filterValues[key])} class="slider" />
        <div class="filter-value">{value}</div>
      </div>
    {/each}
  {:else if selectedReviewer === 'PBEffect'}
    {#each ['power', 'pop', 'twist', 'swing', 'spin'] as attribute}
      <div class="slider-container">
        <label class="filter-label" for="{attribute}Filter">{attribute.charAt(0).toUpperCase() + attribute.slice(1)}:</label>
        <input 
          id="{attribute}Filter" 
          type="range" 
          min="0" 
          max="100" 
          step={attribute === 'spin' ? "25" : "1"}
          bind:value={$pbEffectFilterValues[`${attribute}Filter`]} 
          on:input={() => updateFilter(`${attribute}Filter`, $pbEffectFilterValues[`${attribute}Filter`])} 
          class="slider" 
        />
        <div class="filter-value">
          {attribute === 'spin' ? getSpinLabel($pbEffectFilterValues[`${attribute}Filter`]) : $pbEffectFilterValues[`${attribute}Filter`]}
        </div>
      </div>
    {/each}
  {/if}
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

</style>
