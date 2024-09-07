<script>
  import Radar from '../routes/_components/Radar.svelte'; // Import the Radar component
  import { LayerCake, Svg } from 'layercake';
  import AxisRadial from '../routes/_components/AxisRadial.svelte';

  export let frontContent;
  export let backContent;
  export let radarData; // Accept radar data as a prop
  export let seriesKey; // Accept seriesKey as a prop
  export let xKey; // Accept xKey as a prop

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
    width: 350px; /* Increased width */
    height: 350px;
    margin: 10px auto; /* Center the card horizontally */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid red; /* Debugging border */
    /* background-color: rgba(255, 0, 0, 0.1); */ /* Debugging background */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    transform-origin: center center; /* Ensure the card flips around its center */
    border: 1px solid blue; /* Debugging border */
    /* background-color: rgba(0, 0, 255, 0.1); */ /* Debugging background */
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
    align-items: center;
    justify-content: center;
    font-size: 1.5em;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: black; /* Ensure background color is black */
    color: white; /* Ensure text color is white */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .card-back {
    transform: rotateY(180deg);
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
      <LayerCake
        padding={{ top: 30, right: 0, bottom: 7, left: 0 }}
        x={xKey}
        xDomain={[0, 10]}
        xRange={({ height }) => [0, height / 2]}
        data={[radarData]} 
      >
        <Svg>
          <AxisRadial />
          <Radar data={[radarData]} seriesKey={seriesKey} xKey={xKey} />
        </Svg>
      </LayerCake>
    </div>
    <div class="card-back">
      {backContent}
    </div>
  </div>
</div>