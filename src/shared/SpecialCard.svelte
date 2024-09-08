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
    align-items: center;
    justify-content: center;
    font-size: 1.2em; /* Adjust font size as needed */
    border-radius: 10px; /* Rounded corners */
    padding: 20px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #1e1e1e; /* Darker background color */
    color: white; /* Ensure text color is white */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .card-back {
    transform: rotateY(180deg);
    overflow-y: auto; /* Enable vertical scrolling */
    padding: 20px; /* Add padding to ensure the first bullet is not cut off */
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    font-size: 1em; /* Adjust font size as needed */
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #444; /* Darker border */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .flip-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 1.5em;
    color: #ccc;
    transition: color 0.3s;
  }

  .card:hover .flip-icon {
    color: #fff;
  }

  .excluded-list {
    padding-left: 20px;
    text-align: left;
    width: 100%;
    height: 100%;
    overflow-y: auto; /* Ensure the list is scrollable */
  }

  .excluded-list li {
    font-size: 1em; /* Adjust font size as needed */
    color: white; /* Ensure text color is white */
  }

  .front-text {
    margin-top: 10px; /* Adjust margin to ensure it is below the title */
    font-size: 0.9em;
    color: #ccc;
    text-align: center;
    font-style: italic; /* Make the text italicized */
  }

  .front-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* Align items to the top */
    height: 100%;
    width: 100%;
    padding-top: 20px; /* Add padding to the top */
  }
</style>

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
      <div class="front-content">
        <div class="title-banner">Paddles not included</div>
        <div class="front-text">Some data is missing or invalid to properly render a radar chart for certain paddles</div>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
    <div class="card-back">
      <ul class="excluded-list">
        {#each excludedPaddles as paddle}
          <li>{paddle}</li>
        {/each}
      </ul>
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
  </div>
</div>