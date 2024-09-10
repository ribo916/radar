<script>
  import { selectedPaddlesStore } from '../stores.js'; // Import the store
  import { get } from 'svelte/store';
  import { onMount, afterUpdate } from 'svelte';

  export let paddles = []; // Use the paddles prop passed from +layout.svelte

  let filterText = ''; // Declare filterText
  let filteredPaddles = paddles;

  // Subscribe to the store to keep track of selected paddles
  let selectedPaddles = get(selectedPaddlesStore);

  console.log('Initial Paddles:', paddles);
  console.log('Initial Selected Paddles:', selectedPaddles);

  function handleCheckboxChange(event, paddle) {
    console.log('Checkbox Change Event:', event);
    console.log('Paddle:', paddle);
    console.log('Paddles array in handle checkbox A:', paddles);
    console.log('Selected Paddles before change:', selectedPaddles);
    if (event.target.checked) {
      selectedPaddles = [...selectedPaddles, paddle];
    } else {
      selectedPaddles = selectedPaddles.filter(p => p.company !== paddle.company || p.paddle !== paddle.paddle || p.thickness !== paddle.thickness);
    }
    console.log('Paddles array in handle checkbox B:', paddles);
    selectedPaddlesStore.set(selectedPaddles); // Update the store
    console.log('Paddles array in handle checkbox C:', paddles);
    console.log('Selected Paddles after change:', selectedPaddles);
  }

  function isPaddleSelected(paddle) {
    console.log('Checking if paddle is selected:', paddle);
    const isSelected = selectedPaddles.some(p => p.company === paddle.company && p.paddle === paddle.paddle && p.thickness === paddle.thickness);
    console.log('Is Paddle Selected:', isSelected);
    return isSelected;
  }

  function filterPaddles() {
    console.log('Paddles array in filterPaddles A:', paddles);
    filteredPaddles = paddles.filter(paddle => 
      paddle.paddle.toLowerCase().includes(filterText.toLowerCase()) ||
      paddle.company.toLowerCase().includes(filterText.toLowerCase())
    );
    console.log('Filtered Paddles:', filteredPaddles);
    console.log('Paddles array in filterPaddles B:', paddles);
  }

  // Initialize filtered paddles on mount
  onMount(() => {
    filteredPaddles = paddles;
    console.log('Component Mounted');
    console.log('Initial Paddles:', paddles);
  });

  // Log paddles array after each update
  afterUpdate(() => {
    console.log('Component Updated');
    console.log('Current Paddles:', paddles);
    console.log('Current Selected Paddles:', selectedPaddles);
  });
</script>

<div class="compare-area">
  <div class="dropdown">
    <button class="dropdown-button">Compare Paddles</button>
    <div class="dropdown-content">
      <input type="text" placeholder="Filter paddles..." bind:value={filterText} on:input={filterPaddles} />
      {#each filteredPaddles as { company, paddle, thickness }, index}
        <div class="paddle-item">
          <label for={`paddle-${index}`}>
            <input id={`paddle-${index}`} type="checkbox" checked={isPaddleSelected({ company, paddle, thickness })} on:change={(event) => handleCheckboxChange(event, { company, paddle, thickness })} />
            {paddle} - {thickness} ({company})
          </label>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .compare-area {
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
  }
</style>