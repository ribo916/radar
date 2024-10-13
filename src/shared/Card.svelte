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
  let cardElement;
  let width;
  let height;

  function flipCard() {
    flipped = !flipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  function calculateSize(width, height) {
    return Math.min(width, height) - 60; // Subtract padding
  }

  let chartSize;

  $: if (cardElement) {
    const rect = cardElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    chartSize = calculateSize(width, height);
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

  function getMaxValue(data) {
    if (!data || !data[xKey]) return 10;
    return Math.max(...Object.values(data[xKey]), 10); // Ensure minimum of 10
  }

  $: maxValue = radarData ? getMaxValue(radarData) : 10;
  $: scaleFactor = Math.min(0.9, 10 / maxValue);

  // Add this function to log all properties
  function logAllProperties() {
    // console.log('All properties for this card:', backContent);
  }

  // Call this function when the component mounts
  import { onMount } from 'svelte';
  onMount(() => {
    logAllProperties();
  });

  // Add this function to format the property names
  function formatPropertyName(name) {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  $: {
    console.log('Data received in Card:', backContent);
  }
</script>

<div
  class="card {flipped ? 'flipped' : ''}"
  on:click={flipCard}
  on:keydown={handleKeyDown}
  role="button"
  tabindex="0"
  aria-pressed={flipped}
  bind:this={cardElement}
>
  <div class="card-inner">
    <div class="card-front">
      <div class="title-banner">{company} {seriesKey} - {thickness}</div>
      <div class="front-content">
        <div class="chart-container">
          {#if chartSize && radarData}
            <LayerCake
              padding={{ top: 10, right: 10, bottom: 10, left: 10 }}
              x={xKey}
              xDomain={[0, maxValue]}
              xRange={[0, (chartSize / 2) * scaleFactor]}
              data={[radarData]}
              width={chartSize}
              height={chartSize}
            >
              <Svg>
                <AxisRadial />
                <Radar />
              </Svg>
            </LayerCake>
          {/if}
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
        {#each Object.entries(backContent) as [key, value]}
          {#if !['serveSpeedMPH', 'spinRPM', 'punchVolleySpeed', 'twistWeight', 'swingWeight', 'balancePointCM'].includes(key)}
            <div class="back-content-item">
              <span class="property-name">{formatPropertyName(key)}:</span> 
              {#if key === 'link_to_paddle' && value && value.startsWith('http')}
                <a href={value} target="_blank" rel="noopener noreferrer">Link</a>
              {:else if value !== undefined && value !== ''}
                <span class="property-value">{value}</span>
              {:else}
                <span class="property-value">N/A</span>
              {/if}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    perspective: 1000px;
    width: 100%;
    max-width: 400px;
    aspect-ratio: 7/8;
    margin: 0 auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
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
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    transform: rotate(-30deg);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chart-container :global(svg) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    margin-bottom: 5px;
    font-size: 0.9em;
    text-align: left;
  }

  .property-name {
    font-weight: bold;
    color: #20e87a; /* Adjust color as needed */
  }

  .property-value {
    color: #ffffff; /* Adjust color as needed */
  }

  .back-content-item a {
    color: #4CAF50;
    text-decoration: none;
  }

  .back-content-item a:hover {
    text-decoration: underline;
  }
</style>
