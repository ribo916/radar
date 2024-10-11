<script>
  import { LayerCake, Svg } from 'layercake';
  import AxisRadial from '../routes/_components/AxisRadial.svelte';
  import Radar from '../routes/_components/Radar.svelte';

  export let data;
  export let xKey;

  const colors = ['#ff6b6b', '#4ecdc4', '#45aaf2'];

  let flipped = false;
  let cardElement;
  let chartSize = 300; // Default size

  function flipCard() {
    flipped = !flipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  const specialProperties = {
    'POWER': 'serve_speed_mph',
    'SPIN': 'spin_rpm',
    'POP': 'punch_volley_speed',
    'TWIST WEIGHT': 'twist_weight',
    'SWING WEIGHT': 'swing_weight',
    'BALANCE POINT': 'balance_point_cm',
  };

  function updateChartSize() {
    if (cardElement) {
      const rect = cardElement.getBoundingClientRect();
      chartSize = Math.min(rect.width, rect.height) - 60; // Subtract padding
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
  bind:this={cardElement}
  use:updateChartSize
>
  <div class="card-inner">
    <div class="card-front">
      <div class="title-banner">Overlays Comparisons - 2 or 3 paddles</div>
      <div class="content-wrapper">
        <div class="chart-container">
          <LayerCake
            padding={{ top: 30, right: 30, bottom: 30, left: 30 }}
            x={xKey}
            xDomain={[0, 10]}
            xRange={({ height }) => [0, height / 2]}
            data={data}
            width={chartSize}
            height={chartSize}
          >
            <Svg>
              <AxisRadial />
              {#each data as paddle, i}
                <Radar 
                  fill={colors[i]} 
                  stroke={colors[i]} 
                  fillOpacity={0.2} 
                  strokeWidth={2}
                  paddleData={paddle}
                />
              {/each}
            </Svg>
          </LayerCake>
        </div>
        <div class="legend">
          {#each data as paddle, i}
            <div class="legend-item">
              <span class="color-box" style="background-color: {colors[i]};"></span>
              <span>{paddle.company} {paddle.paddle}</span>
            </div>
          {/each}
        </div>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i>
    </div>
    <div class="card-back">
      <div class="title-banner">Comparison Details</div>
      <div class="back-content">
        {#each data as paddle, i}
          <div class="paddle-details" style="color: {colors[i]};">
            <h3>{paddle.company} {paddle.paddle}</h3>
            <div class="special-properties-grid">
              {#each Object.entries(specialProperties) as [label, key]}
                <div class="special-property">
                  <div class="special-label">{label}</div>
                  <div class="special-value">
                    {#if ['POWER', 'POP'].includes(label)}
                      {paddle[key]} MPH
                    {:else if label === 'SPIN'}
                      {paddle[key]} RPM
                    {:else if label === 'BALANCE POINT'}
                      {paddle[key]} cm
                    {:else}
                      {paddle[key]}
                    {/if}
                  </div>
                </div>
              {/each}
            </div>
            <div class="regular-properties">
              <p>Thickness: <i>{paddle.thickness} mm</i></p>
              <p>Power: <i>{Math.round(paddle.Power * 10)}%</i></p>
              <p>Spin: <i>{Math.round(paddle.Spin * 10)}%</i></p>
              <p>Pop: <i>{Math.round(paddle.Pop * 10)}%</i></p>
              <p>Twist: <i>{Math.round(paddle.Twist * 10)}%</i></p>
              <p>Balance: <i>{Math.round(paddle.Balance * 10)}%</i></p>
              <p>Swing: <i>{Math.round(paddle.Swing * 10)}%</i></p>
              <p>Shape: <i>{paddle.shape}</i></p>
              <p>Face Material: <i>{paddle.face_material}</i></p>
              <p>Handle Length: <i>{paddle.handle_length}</i></p>
              <p>Core Material: <i>{paddle.core_material}</i></p>
              <p>Surface Texture: <i>{paddle.surface_texture}</i></p>
              <p>Length: <i>{paddle.length}</i></p>
              <p>Width: <i>{paddle.width}</i></p>
              <p>Static Weight: <i>{paddle.static_weight}</i></p>
            </div>
          </div>
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
    transform-origin: center center;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
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
    text-align: left;
    overflow-y: auto;
    font-size: 0.75em;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .paddle-details {
    margin: 0;
    padding: 20px;  /* Increased padding */
    box-sizing: border-box;
    width: 100%;
  }

  .paddle-details h3 {
    margin: 0 0 30px 0;  /* Significantly increased bottom margin */
    font-size: 1.33em;
    padding-bottom: 10px;  /* Added padding at the bottom */
    border-bottom: 1px solid currentColor;  /* Added a subtle border for visual separation */
  }

  .special-properties-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    margin-bottom: 15px;
    margin-top: 20px;  /* Added top margin to the grid */
  }

  .special-property {
    position: relative;
    border: 2px solid white;
    border-radius: 10px;
    padding: 10px;
    box-sizing: border-box;
    background-color: rgba(32, 232, 122, 0.1); /* Light green background */
  }

  .special-label {
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: #1e1e1e;
    padding: 0 5px;
    font-size: 0.8em;
    color: white;
  }

  .special-value {
    font-size: 1.2em;
    color: #20e87a; /* Green text color */
    text-align: center;
  }

  .regular-properties p {
    margin: 2px 0;
    font-size: 0.9em;
  }

  .regular-properties i {
    color: currentColor;
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    font-size: 15px;  /* Set to exactly 15px to match Card.svelte */
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #444; /* Darker border */
    box-sizing: border-box; /* Ensure padding and border are included in the element's total width and height */
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    overflow-y: auto;
  }

  .chart-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transform: rotate(-30deg);
  }

  .chart-container :global(svg) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .legend {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 5px;
    font-size: 0.5em; /* Reduce font size by 50% */
    margin-top: 10px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 2.5px; /* Reduced from 5px */
  }

  .color-box {
    width: 7.5px; /* Reduced from 15px */
    height: 7.5px; /* Reduced from 15px */
    margin-right: 2.5px; /* Reduced from 5px */
    border-radius: 50%;
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

  .paddle-details {
    margin-bottom: 15px;
    text-align: left;
  }

  .paddle-details h3 {
    margin-bottom: 5px;
    font-size: 1.33em; /* Adjusted to match the original size relative to the new card-back font size */
  }

  .paddle-details p {
    margin: 2px 0;
    font-size: 0.9em;
  }

  /* Debugging styles */
  .paddle-details {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .back-content {
    padding: 20px;
    overflow-y: auto;
    height: calc(100% - 40px); /* Adjust based on your title banner height */
  }

  .paddle-details {
    margin-bottom: 20px;
  }

  .paddle-details h3 {
    margin-bottom: 10px;
  }

  .paddle-details p {
    margin: 5px 0;
    font-size: 0.9em;
  }
</style>