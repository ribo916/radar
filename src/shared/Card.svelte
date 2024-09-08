<script>
  import Radar from '../routes/_components/Radar.svelte'; // Import the Radar component
  import { LayerCake, Svg } from 'layercake';
  import AxisRadial from '../routes/_components/AxisRadial.svelte';

  export let backContent;
  export let radarData; // Accept radar data as a prop
  export let seriesKey; // Accept seriesKey as a prop (actual paddle name)
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
  }

  .chart-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden; /* Ensure content does not overflow the container */
    transform: rotate(-30deg); /* Rotate the radar chart by 30 degrees counter-clockwise */
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
      <div class="title-banner">{seriesKey}</div> <!-- Title banner for the seriesKey -->
      <div class="chart-container">
        <LayerCake
          padding={{ top: 30, right: 30, bottom: 30, left: 30 }} 
          x={xKey}
          xDomain={[0, 10]}
          xRange={({ height }) => [0, height / 2]}
          data={[radarData]} 
          width={300} 
          height={300} 
        >
          <Svg width={300} height={300}>
            <AxisRadial />
            <Radar data={[radarData]} seriesKey={seriesKey} xKey={xKey} />
          </Svg>
        </LayerCake>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
    <div class="card-back">
      {backContent}
      <i class="fas fa-sync-alt flip-icon"></i> <!-- Flip icon -->
    </div>
  </div>
</div>