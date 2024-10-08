<script>
  import { selectedPaddlesStore } from '../stores.js'; // Import the store
  import { writable } from 'svelte/store';
  import { onMount } from 'svelte';

  export let paddles = []; // Use the paddles prop passed from +layout.svelte

  // Create an immutable constant for the full list of paddles
  const FULL_PADDLES_LIST = [...paddles];

  let filterText = ''; // Declare filterText
  const filteredPaddlesStore = writable([]);

  // Subscribe to the store to keep track of selected paddles
  let selectedPaddles = [];
  selectedPaddlesStore.subscribe(value => {
    selectedPaddles = value;
  });

  function handleCheckboxChange(event, paddle) {
    if (event.target.checked) {
      selectedPaddles = [...selectedPaddles, paddle];
    } else {
      selectedPaddles = selectedPaddles.filter(p => p.company !== paddle.company || p.paddle !== paddle.paddle || p.thickness !== paddle.thickness);
    }
    selectedPaddlesStore.set(selectedPaddles); // Update the store
    filterPaddles(); // Reapply filter to include selected paddles
  }

  function isPaddleSelected(paddle) {
    return selectedPaddles.some(p => p.company === paddle.company && p.paddle === paddle.paddle && p.thickness === paddle.thickness);
  }

  function filterPaddles() {
    //console.log('filter paddles hit...');
    //console.log('filterText:', filterText);
    //console.log('selectedPaddles:', selectedPaddles);
    //console.log('FULL_PADDLES_LIST:', FULL_PADDLES_LIST);
    //console.log('filteredPaddlesStore:', $filteredPaddlesStore);

    // Start with the full list of paddles
    let filteredPaddles = FULL_PADDLES_LIST;

    // If there is filter text, filter the paddles
    if (filterText.trim() !== '') {
      //console.log('filter text applied...');
      filteredPaddles = FULL_PADDLES_LIST.filter(paddle => 
        paddle.paddle.toLowerCase().includes(filterText.toLowerCase()) ||
        paddle.company.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    //console.log('filteredPaddles:', filteredPaddles);
    //console.log('selectedPaddlesStore', $selectedPaddlesStore);

    // Ensure selected paddles are always included
    const mergedPaddles = [...filteredPaddles, ...selectedPaddles.filter(paddle => 
      !filteredPaddles.some(fp => fp.company === paddle.company && fp.paddle === paddle.paddle && fp.thickness === paddle.thickness)
    )];

    //console.log('mergedPaddles:', mergedPaddles);
    filteredPaddlesStore.set(mergedPaddles); // Update the store with the merged paddles
    //console.log('filteredPaddlesStore after set:', $filteredPaddlesStore);
  }

  function clearSelection() {
    selectedPaddlesStore.set([]);
    filterText = '';
    filteredPaddlesStore.set(FULL_PADDLES_LIST);
    // Manually uncheck all checkboxes
    document.querySelectorAll('.paddle-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.checked = false;
    });
    // Simulate pressing the "Clear" button a second time
    setTimeout(() => {
      selectedPaddlesStore.set([]);
      filterText = '';
      filteredPaddlesStore.set(FULL_PADDLES_LIST);
      document.querySelectorAll('.paddle-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
      });
    }, 0);
  }

  // Initialize filtered paddles on mount
  onMount(() => {
    filteredPaddlesStore.set(FULL_PADDLES_LIST); // Initialize the filtered paddles store
  });
</script>

<div class="compare-area">
  <div class="dropdown">
    <button class="dropdown-button">Compare Paddles</button>
    <div class="dropdown-content">
      <input type="text" placeholder="Filter paddles..." bind:value={filterText} on:input={filterPaddles} />
      {#each $filteredPaddlesStore as { company, paddle, thickness }, index}
        <div class="paddle-item">
          <label for={`paddle-${index}`}>
            <input id={`paddle-${index}`} type="checkbox" checked={isPaddleSelected({ company, paddle, thickness })} on:change={(event) => handleCheckboxChange(event, { company, paddle, thickness })} />
            {company} {paddle} - {thickness}mm
          </label>
        </div>
      {/each}
    </div>
  </div>
  <button class="clear-button" on:click={clearSelection}>Clear</button>
</div>

<style>
  .compare-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: #fff;
    font-size: 0.75em; /* Changed from 1em to match card font size */
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
    margin-bottom: 10px;
    border-color: #333;
    background-color: #000;
  }

  .dropdown {
    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 300px;
  }

  .dropdown-button {
    width: 100%;
    padding: 10px;
    border-radius: 4px;
    background-color: #000;
    color: #fff;
    border: 1px solid #ccc;
    cursor: pointer;
    text-align: left;
    font-size: 1em; /* This will be relative to the new base size */
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: #000;
    min-width: 100%;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .paddle-item {
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    font-size: 0.9em; /* Slightly smaller than the button */
  }

  .paddle-item label {
    display: flex;
    align-items: center;
    color: #fff;
  }

  .paddle-item input[type="checkbox"] {
    margin-right: 10px;
  }

  .dropdown-content input[type="text"] {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    font-size: 0.9em; /* Match the paddle item size */
  }

  .clear-button {
    margin-left: 10px;
    padding: 10px;
    border-radius: 4px;
    background-color: #000;
    color: #fff;
    border: 1px solid #ccc;
    cursor: pointer;
    text-align: center;
    font-size: 1em; /* Match the dropdown button size */
  }
</style>