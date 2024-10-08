<script>
  import { LayerCake, Svg } from 'layercake';
  import AxisRadial from '../routes/_components/AxisRadial.svelte';
  import Radar from '../routes/_components/Radar.svelte';

  export let data;
  export let xKey;

  // Define a consistent color palette
  const colors = ['#ff6b6b', '#4ecdc4', '#45aaf2']; // Different colors for each paddle

  $: console.log('ComparisonCard: Number of paddles:', data.length);
  $: console.log('ComparisonCard xKey:', xKey);

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
      <div class="title-banner">Paddle Comparison - Under Construction</div>
      <div class="chart-container">
        <LayerCake
          padding={{ top: 30, right: 30, bottom: 30, left: 30 }}
          x={xKey}
          xDomain={[0, 10]}
          xRange={({ height }) => [0, height / 2]}
          data={data}
          width={300}
          height={300}
        >
          <Svg>
            <AxisRadial />
            {#each data as paddle, i}
              {@const paddleColor = colors[i]}
              {@const paddleName = paddle.company + ' ' + paddle.paddle}
              <Radar 
                fill={paddleColor} 
                stroke={paddleColor} 
                fillOpacity={0.2} 
                strokeWidth={2}
              />
              {console.log(`Color assigned to ${paddleName}: ${paddleColor}`)}
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
      <i class="fas fa-sync-alt flip-icon"></i>
    </div>
    <div class="card-back">
      <div class="title-banner">Comparison Details</div>
      {#each data as paddle, i}
        <div class="paddle-details" style="color: {colors[i]};">
          <h3>{paddle.company} {paddle.paddle}</h3>
          <p>Thickness: {paddle.thickness} mm</p>
          <!-- Add more details as needed -->
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .card {
    perspective: 1000px;
    width: 350px;
    height: 400px;
    margin: 10px auto;
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
    align-items: center;
    justify-content: flex-start;
    font-size: 1.2em;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #1e1e1e;
    color: white;
    box-sizing: border-box;
  }

  .card-back {
    transform: rotateY(180deg);
    text-align: left;
    overflow-y: auto;
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    font-size: 1em;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #444;
    box-sizing: border-box;
  }

  .chart-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform: rotate(-30deg); /* Rotate the radar chart by 30 degrees counter-clockwise */
  }

  .legend {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 10px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }

  .color-box {
    width: 15px;
    height: 15px;
    margin-right: 5px;
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
  }
</style>
