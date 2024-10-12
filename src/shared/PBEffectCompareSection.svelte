<!-- src/shared/PBEffectCompareSection.svelte -->
<script>
  import { pbEffectSelectedPaddlesStore } from '../stores.js';
  import { writable } from 'svelte/store';

  export let paddles = [];

  const FULL_PADDLES_LIST = [...paddles];
  let filterText = '';
  const filteredPaddlesStore = writable(FULL_PADDLES_LIST);

  function handleCheckboxChange(event, paddle) {
    if (event.target.checked) {
      pbEffectSelectedPaddlesStore.update(selected => [...selected, paddle]);
    } else {
      pbEffectSelectedPaddlesStore.update(selected => 
        selected.filter(p => p.company !== paddle.company || p.paddle !== paddle.paddle || p.thickness !== paddle.thickness)
      );
    }
    filterPaddles();
  }

  function isPaddleSelected(paddle) {
    return $pbEffectSelectedPaddlesStore.some(p => 
      p.company === paddle.company && p.paddle === paddle.paddle && p.thickness === paddle.thickness
    );
  }

  function filterPaddles() {
    let filteredPaddles = FULL_PADDLES_LIST;

    if (filterText.trim() !== '') {
      filteredPaddles = FULL_PADDLES_LIST.filter(paddle => 
        paddle.paddle.toLowerCase().includes(filterText.toLowerCase()) ||
        paddle.company.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    const mergedPaddles = [...filteredPaddles, ...$pbEffectSelectedPaddlesStore.filter(paddle => 
      !filteredPaddles.some(fp => fp.company === paddle.company && fp.paddle === paddle.paddle && fp.thickness === paddle.thickness)
    )];

    filteredPaddlesStore.set(mergedPaddles);
  }
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
</div>

<style>
  .compare-area {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: #fff;
    font-size: 0.75em;
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
    font-size: 1em;
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
    font-size: 0.9em;
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
    font-size: 0.9em;
  }
</style>
