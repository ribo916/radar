<script>
  import { LayerCake, Svg } from 'layercake';
  import Radar from './_components/Radar.svelte';
  import AxisRadial from './_components/AxisRadial.svelte';
  import data from './_data/radarScores.csv';
  import Card from '../shared/Card.svelte';

  const seriesKey = 'paddle';
  const xKey = ['power', 'spin', 'twist', 'balance', 'swing', 'pop'];
  const seriespaddles = Object.keys(data[0]).filter(d => d !== seriesKey);

  // Filter out invalid records
  const filteredData = data.filter((d) => {
    let allValid = true; // Flag to check if all numbers are valid

    // Check if all expected keys are present and valid
    seriespaddles.forEach(paddle => {
      const value = d[paddle];
      if (value === undefined || value === '' || isNaN(+value) || +value <= 0) {
        allValid = false; // If any value is missing or invalid, set flag to false
      }
    });

    if (allValid) {
      seriespaddles.forEach(paddle => {
        d[paddle] = +d[paddle] * 10; // Convert the scores to numbers if all are valid
      });
    } else {
      console.log('Skipping entry due to invalid or missing data:', d); // Log the invalid entry
    }

    return allValid; // Return true to keep valid records
  });
</script>

<!-- Iterate through each valid record and display the paddle and chart -->
{#each filteredData as record}

<Card>
  <!-- Display the paddle above each chart -->
  <h3 style="text-align: center;">{record[seriesKey]}</h3>

  <div class="chart-block">
    <div class="chart-container" style="transform: rotate(-30deg);">
      <LayerCake
        padding={{ top: 30, right: 0, bottom: 7, left: 0 }}
        x={xKey}
        xDomain={[0, 10]}
        xRange={({ height }) => [0, height / 2]}
        data={[record]} 
      >
        <Svg>
          <AxisRadial />
          <Radar />
        </Svg>
      </LayerCake>
    </div>
  </div>
</Card>

{/each}

<style>
  .chart-container {
    width: 100%;
    height: 250px;
  }

  .chart-block {
    margin-bottom: 50px; /* Add some space between charts */
  }
</style>
