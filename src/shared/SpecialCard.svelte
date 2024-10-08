<script>
  export let excludedPaddles = []; // Accept the list of excluded paddles as a prop

  let flipped = false;

  function flipCard() {
    flipped = !flipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }
</script>

<div
  class="card {flipped ? 'flipped' : ''}"
  on:click={flipCard}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
  aria-pressed={flipped}
>
  <div class="card-inner">
    <div class="card-front">
      <div class="title-banner">{excludedPaddles.length} paddles not included</div>
      <div class="front-content">
        <div class="front-text">Some data is missing or invalid to properly render a radar chart for certain paddles so these are all skipped.</div>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
    <div class="card-back">
      <div class="title-banner">Excluded Paddles</div>
      <div class="back-content">
        <ul class="excluded-list">
          {#each excludedPaddles as paddle}
            <li>{paddle}</li>
          {/each}
        </ul>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
  </div>
</div>

<style>
  .card {
    perspective: 1000px;
    width: 350px; /* Fixed width */
    height: 400px; /* Fixed height */
    margin: 10px auto; /* Center the card horizontally */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  }

  .card:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform-origin: center center; /* Ensure the card flips around its center */
    border: 1px solid rgba(255, 255, 255, 0.2); /* Subtle border */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .card.flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    font-size: 0.75em; /* Changed from 1.2em to match other cards */
    border-radius: 10px; /* Rounded corners */
    padding: 0;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #2a2a2a; /* Slightly lighter background for contrast */
    color: #a0a0a0; /* Light grey for the main text color */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
    overflow: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #3a3a3a; /* Darker grey for the title banner */
    color: #c0c0c0; /* Lighter grey for the title text */
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #4a4a4a; /* Slightly lighter border */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .flip-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 1.5em;
    color: #808080; /* Medium grey for the flip icon */
    transition: color 0.3s;
  }

  .card:hover .flip-icon {
    color: #a0a0a0; /* Lighter grey when hovering */
  }

  .excluded-list {
    padding-left: 20px;
    text-align: left;
    width: 100%;
    height: 100%;
    overflow-y: auto; /* Ensure the list is scrollable */
  }

  .excluded-list li {
    font-size: 0.9em; /* Adjust font size as needed */
    color: #a0a0a0; /* Light grey for list items */
    margin-bottom: 5px;
  }

  .front-text {
    margin-top: 10px; /* Adjust margin to ensure it is below the title */
    font-size: 0.9em;
    color: #909090; /* Medium grey for the front text */
    text-align: center;
    font-style: italic; /* Make the text italicized */
  }

  .front-content, .back-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Align items to the top */
    padding: 20px;
    overflow-y: auto;
  }
</style>