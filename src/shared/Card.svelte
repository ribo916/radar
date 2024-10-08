<script>
  import Radar from '../routes/_components/Radar.svelte'; // Import the Radar component
  import { LayerCake, Svg } from 'layercake';
  import AxisRadial from '../routes/_components/AxisRadial.svelte';

  export let backContent;
  export let radarData; // Accept radar data as a prop
  export let seriesKey; // Accept seriesKey as a prop (actual paddle name)
  export let xKey; // Accept xKey as a prop
  export let thickness; // Accept thickness as a prop
  export let company; // Accept company as a prop

  let flipped = false;

  function flipCard() {
    flipped = !flipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  // Special properties to highlight
  const specialProperties = {
    'POWER': 'serveSpeedMPH',
    'SPIN': 'spinRPM',
    'POP': 'punchVolleySpeed',
    'TWIST WEIGHT': 'twistWeight',
    'SWING WEIGHT': 'swingWeight',
    'BALANCE POINT': 'balancePointCM',
    'power': 'power',
    'spin': 'spin',
    'twist': 'twist',
    'balance': 'balance',
    'swing': 'swing',
    'pop': 'pop',
    'shape': 'shape',
    'faceMaterial': 'faceMaterial',
    'handleLength': 'handleLength',
    'coreMaterial': 'coreMaterial',
    'surfaceTexture': 'surfaceTexture',
    'length': 'length',
    'width': 'width',
    'staticWeight': 'staticWeight'
  };
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
      <div class="title-banner">{company} {seriesKey} - {thickness}</div>
      <div class="front-content">
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
            <Svg>
              <AxisRadial />
              <Radar />
            </Svg>
          </LayerCake>
        </div>
        <i class="fas fa-sync-alt flip-icon"></i>
      </div>
    </div>
    <div class="card-back">
      <div class="title-banner">{company} {seriesKey} - {thickness}</div>
      <div class="back-content">
        <br>
        <!-- Special properties section -->
        <div class="special-properties-grid">
          {#each Object.entries(specialProperties) as [label, key]}
            {#if ['serveSpeedMPH', 'spinRPM', 'punchVolleySpeed', 'twistWeight', 'swingWeight', 'balancePointCM'].includes(key) && backContent[key] !== undefined}
              <div class="special-property">
                <div class="special-label">{label}</div>
                <div class="special-value">
                  {backContent[key]}
                  {#if label === 'POWER' || label === 'POP'}
                    MPH
                  {/if}
                  {#if label === 'SPIN'}
                    RPM
                  {/if}
                  {#if label === 'BALANCE POINT'}
                    cm
                  {/if}
                </div>
              </div>
            {/if}
          {/each}
        </div>
        <br>
        <!-- Regular properties section -->
        {#each Object.entries(specialProperties) as [label, key]}
          {#if !['serveSpeedMPH', 'spinRPM', 'punchVolleySpeed', 'twistWeight', 'swingWeight', 'balancePointCM'].includes(key) && backContent[key] !== undefined}
            <div class="back-content-item">{label} : <i>{backContent[key]}</i></div>
          {/if}
        {/each}
      </div>
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
    font-size: 0.75em;
    border-radius: 10px;
    padding: 0;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #1e1e1e;
    color: white;
    box-sizing: border-box;
    overflow: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
    text-align: left; /* Left-align the text */
    overflow-y: auto; /* Add vertical scrollbar */
    font-size: 0.75em; /* Explicitly set to match ComparisonCard */
  }

  .card-back i {
    color: rgb(234, 99, 207); 
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #444;
    box-sizing: border-box;
  }

  .front-content, .back-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 20px;
    overflow-y: auto;
  }

  .chart-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: rotate(-30deg);
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

  /* Special properties styling */
  .special-properties-grid {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Two equal columns */
    gap: 10px; /* Space between items */
    width: 100%;
    margin-bottom: 15px; /* Added to match ComparisonCard */
  }

  .special-property {
    position: relative; /* Make the container relative for absolute positioning of the label */
    border: 2px solid white; /* White border */
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(32, 232, 122, 0.1); /* Added to match ComparisonCard */
  }

  .special-label {
    position: absolute; /* Position the label absolutely */
    top: -10px; /* Adjust the position to overlap the border */
    left: 10px; /* Adjust the position to align with the padding */
    background-color: #1e1e1e; /* Match the background color of the card */
    padding: 0 5px; /* Add some padding to the label */
    font-size: 0.8em; /* Changed from 0.5em to match ComparisonCard */
    color: white; /* White label text */
    margin-bottom: 5px;
  }

  .special-value {
    font-size: 1.2em; /* Changed from 1.0em to match ComparisonCard */
    color: #20e87a; /* Keep this unchanged as it matches ComparisonCard */
  }

  .back-content-item {
    margin-bottom: 2px; /* Changed from 5px to match ComparisonCard's regular properties */
    font-size: 0.9em; /* Added to match ComparisonCard's regular properties */
    text-align: left; /* Ensure text is left-aligned */
  }
</style>