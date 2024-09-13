<script>
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';
  import { onMount } from 'svelte';
  import { paddlesStore, selectedPaddlesStore } from '../stores.js'; // Import the stores
  import { loadAndProcessData } from './dataProcessor.js'; // Import the utility function

  const seriesKey = 'paddle';
  const xKey = ['power_percentile', 'spin_percentile', 'twist_percentile', 'balance_percentile', 'swing_percentile', 'pop_percentile'];

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

  let filteredData = [];
  let excludedPaddles = [];
  let processedData = [];
  let loading = true; // Add loading state

  onMount(async () => {
    const { filteredData: fd, excludedPaddles: ep } = await loadAndProcessData('/radarScores.csv'); // Correct path to the CSV file
    filteredData = fd;
    excludedPaddles = ep;
    loading = false; // Set loading to false once data is loaded

    //console.log('Filtered Data on Mount:', filteredData);
    // console.log('Excluded Paddles on Mount:', excludedPaddles);

    // Dispatch the total number of valid paddles to the layout
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
      //console.log('Filters Set:', { powerFilter, spinFilter, popFilter, twistFilter, balanceFilter, swingFilter });
    });
  });

  // Subscribe to the selected paddles store
  let selectedPaddles = [];
  selectedPaddlesStore.subscribe(value => {
    selectedPaddles = value;
    //console.log('Selected Paddles:', selectedPaddles);
  });

  // Create a new array of objects with the desired keys
  $: {
    //console.log('Filtered Data before processing:', filteredData);
    processedData = filteredData.map(record => {
      const newRecord = {};
      for (const key in record) {
        if (labelMapping[key]) {
          newRecord[labelMapping[key]] = record[key];
        } else {
          newRecord[key] = record[key];
        }
      }
      //console.log('Processed Record:', newRecord);
      return newRecord;
    });
    //console.log('Processed Data:', processedData);
  }

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

  //console.log('Filtered Processed Data:', filteredProcessedData);

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
  $: {
    paddlesStore.set(filteredProcessedData);
  }
</script>

<style>
  /* Include the spinner CSS here if not already in your main stylesheet */
  .spinner-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 100%;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Optional: Add a semi-transparent background */
  }

  .spinner {
    border: 8px solid #f3f3f3; /* Light grey */
    border-top: 8px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 60px;
    height: 60px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

{#if loading}
  <div class="spinner-wrapper">
    <div class="spinner"></div>
  </div>
{:else}
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
    <SpecialCard {excludedPaddles} />
{/if}