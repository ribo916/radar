<script>
  import { LayerCake, Svg } from 'layercake';
  import Radar from './_components/Radar.svelte';
  import AxisRadial from './_components/AxisRadial.svelte';
  import data from './_data/radarScores.csv';
  import Card from '../shared/Card.svelte';
  import Card2 from '../shared/Card2.svelte'; // Import the new Card2 component

  const seriesKey = 'paddle';
  const xKey = ['power', 'spin', 'twist', 'balance', 'swing', 'pop'];
  const seriespaddles = Object.keys(data[0]).filter(d => d !== seriesKey);

  const filteredData = data.filter((d) => {
    let allValid = true;
    seriespaddles.forEach(paddle => {
      const value = d[paddle];
      if (value === undefined || value === '' || isNaN(+value) || +value <= 0) {
        allValid = false;
      }
    });

    if (allValid) {
      seriespaddles.forEach(paddle => {
        d[paddle] = +d[paddle] * 10;
      });
    } else {
      console.log('Skipping entry due to invalid or missing data:', d);
    }

    return allValid;
  });

  console.log('Filtered Data:', filteredData);
</script>

<!-- Loop through filteredData and create a Card2 for each paddle -->
{#each filteredData as record}
  <Card2 
    frontContent={record[seriesKey]} 
    backContent={`Power: ${record.power}`} 
    radarData={record} 
    seriesKey={seriesKey} 
    xKey={xKey} 
  />
{/each}

<style>
  .chart-container {
    width: 100%;
    height: 250px;
  }

  .chart-block {
    margin-bottom: 50px;
  }
</style>