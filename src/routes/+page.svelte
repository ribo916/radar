<script>
  import data from './_data/radarScores.csv';
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';

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

  const excludedPaddles = data
    .filter(d => !filteredData.includes(d))
    .map(d => d[seriesKey]);

  console.log('Filtered Data:', filteredData);
  console.log('Excluded Paddles:', excludedPaddles);
</script>

<!-- Loop through filteredData and create a Card for each paddle -->
{#each filteredData as record}
<Card 
  backContent={`
    Power: ${Math.round(record.power * 10)}%\n
    Spin: ${Math.round(record.spin * 10)}%\n
    Twist: ${Math.round(record.twist * 10)}%\n
    Balance: ${Math.round(record.balance * 10)}%\n
    Swing: ${Math.round(record.swing * 10)}%\n
    Pop: ${Math.round(record.pop * 10)}%
  `} 
  radarData={record} 
  seriesKey={record[seriesKey]} 
  xKey={xKey} 
/>
{/each}

<!-- Add the SpecialCard for excluded paddles -->
<SpecialCard {excludedPaddles} />

