<script>
  import data from './_data/radarScores.csv';
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';
  import { onMount } from 'svelte';
  import { paddlesStore, selectedPaddlesStore } from '../stores.js'; // Import the stores

  const seriesKey = 'paddle';
  const xKey = ['power_percentile', 'spin_percentile', 'twist_percentile', 'balance_percentile', 'swing_percentile', 'pop_percentile'];
  const seriespaddles = Object.keys(data[0]).filter(d => !xKey.includes(d) && d !== seriesKey);

  const labelMapping = {
    power_percentile: 'Power',
    spin_percentile: 'Spin',
    twist_percentile: 'Twist',
    balance_percentile: 'Balance',
    swing_percentile: 'Swing',
    pop_percentile: 'Pop'
  };

  let powerFilter = 0;
  let spinFilter = 0;
  let popFilter = 0;
  let twistFilter = 0;
  let balanceFilter = 0;
  let swingFilter = 0;

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

  // Sort filteredData alphabetically by paddle name
  filteredData.sort((a, b) => a[seriesKey].localeCompare(b[seriesKey]));

  const excludedPaddles = data
    .filter(d => !filteredData.includes(d))
    .map(d => d[seriesKey])
    .sort((a, b) => a.localeCompare(b));

  // Subscribe to the selected paddles store
  let selectedPaddles = [];
  selectedPaddlesStore.subscribe(value => {
    selectedPaddles = value;
  });

  // Dispatch the total number of valid paddles to the layout
  onMount(() => {
    window.addEventListener('getTotalValidPaddles', (event) => {
      event.detail.callback(filteredData.length);
    });

    window.addEventListener('setFilters', (event) => {
      powerFilter = event.detail.powerFilter;
      spinFilter = event.detail.spinFilter;
      popFilter = event.detail.popFilter;
      twistFilter = event.detail.twistFilter;
      balanceFilter = event.detail.balanceFilter;
      swingFilter = event.detail.swingFilter;
    });
  });

  // Create a new array of objects with the desired keys
  const processedData = filteredData.map(record => {
    const newRecord = {};
    for (const key in record) {
      if (labelMapping[key]) {
        newRecord[labelMapping[key]] = record[key];
      } else {
        newRecord[key] = record[key];
      }
    }
    return newRecord;
  });

  // Filter processedData based on the filters and selected paddles
  $: filteredProcessedData = processedData.filter(record => 
    record.Power * 10 > powerFilter &&
    record.Spin * 10 > spinFilter &&
    record.Pop * 10 > popFilter &&
    record.Twist * 10 > twistFilter &&
    record.Balance * 10 > balanceFilter &&
    record.Swing * 10 > swingFilter &&
    (selectedPaddles.length === 0 || selectedPaddles.some(p => p.paddle === record[seriesKey] && p.company === record.company && p.thickness === record.thickness))
  );

  // Dispatch the filtered paddles count to the layout
  $: if (typeof window !== 'undefined') {
    const event = new CustomEvent('updateFilteredPaddlesCount', {
      detail: {
        count: filteredProcessedData.length
      }
    });
    window.dispatchEvent(event);
  }

  // Update the store with the filtered processed data
  $: paddlesStore.set(filteredProcessedData);
</script>

<!-- Loop through filteredProcessedData and create a Card for each paddle -->
{#each filteredProcessedData as record}
<Card 
  backContent={{
    power: `${Math.round(record.Power * 10)}%`,
    spin: `${Math.round(record.Spin * 10)}%`,
    twist: `${Math.round(record.Twist * 10)}%`,
    balance: `${Math.round(record.Balance * 10)}%`,
    swing: `${Math.round(record.Swing * 10)}%`,
    pop: `${Math.round(record.Pop * 10)}%`,
    shape: record.shape,
    faceMaterial: record.face_material,
    handleLength: record.handle_length,
    spinRPM: record.spin_rpm,
    serveSpeedMPH: record.serve_speed_mph,
    punchVolleySpeed: record.punch_volley_speed,
    swingWeight: record.swing_weight,
    twistWeight: record.twist_weight,
    coreMaterial: record.core_material,
    surfaceTexture: record.surface_texture,
    length: record.length,
    width: record.width,
    staticWeight: record.static_weight,
    balancePointCM: record.balance_point_cm
  }} 
  radarData={record} 
  seriesKey={record[seriesKey]} 
  xKey={Object.values(labelMapping)}
  thickness={`${record.thickness} mm`} 
  company={record.company}
/>
{/each}

<!-- Add the SpecialCard for excluded paddles -->
<SpecialCard {excludedPaddles} excludedCount={excludedPaddles.length} />