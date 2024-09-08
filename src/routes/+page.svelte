<script>
  import data from './_data/radarScores.csv';
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';

  const seriesKey = 'paddle';
  const xKey = ['power_percentile', 'spin_percentile', 'twist_percentile', 'balance_percentile', 'swing_percentile', 'pop_percentile'];
  const seriespaddles = Object.keys(data[0]).filter(d => !xKey.includes(d) && d !== seriesKey);

  const filteredData = data.filter((d) => {
    let allValid = true;
    xKey.forEach(key => {
      const value = d[key];
      if (value === undefined || value === '' || isNaN(+value) || +value <= 0) {
        allValid = false;
      }
    });

    if (allValid) {
      xKey.forEach(key => {
        d[key] = +d[key] * 10;
      });
    } else {
      // console.log('Skipping entry due to invalid or missing data:', d);
    }

    return allValid;
  });

  const excludedPaddles = data
    .filter(d => !filteredData.includes(d))
    .map(d => d[seriesKey]);

  // console.log('Filtered Data:', filteredData);
  // console.log('Excluded Paddles:', excludedPaddles);
</script>

<!-- Loop through filteredData and create a Card for each paddle -->
{#each filteredData as record}
<Card 
  backContent={{
    company: record.company,
    thickness: `${record.thinkness} mm`,
    shape: record.shape,
    faceMaterial: record.face_material,
    handleLength: record.handle_length,
    spinRPM: record.spin_rpm,
    swingWeight: record.swing_weight,
    twistWeight: record.twist_weight,
    coreMaterial: record.core_material,
    surfaceTexture: record.surface_texture,
    length: record.length,
    width: record.width,
    staticWeight: record.static_weight,
    balancePointCM: record.balance_point_cm,
    serveSpeedMPH: record.serve_speed_mph,
    punchVolleySpeed: record.punch_volley_speed,
    power: `${Math.round(record.power_percentile * 10)}%`,
    spin: `${Math.round(record.spin_percentile * 10)}%`,
    twist: `${Math.round(record.twist_percentile * 10)}%`,
    balance: `${Math.round(record.balance_percentile * 10)}%`,
    swing: `${Math.round(record.swing_percentile * 10)}%`,
    pop: `${Math.round(record.pop_percentile * 10)}%`
  }} 
  radarData={record} 
  seriesKey={record[seriesKey]} 
  xKey={xKey}
  thickness={`${record.thinkness} mm`} 
/>
{/each}

<!-- Add the SpecialCard for excluded paddles -->
<SpecialCard {excludedPaddles} />