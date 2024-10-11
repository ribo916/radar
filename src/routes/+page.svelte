<script>
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';
  import { onMount } from 'svelte';
  import { paddlesStore, selectedPaddlesStore, selectedReviewerStore } from '../stores.js'; // Import the stores
  import { loadAndProcessData } from './dataProcessor.js'; // Import the utility function
  import ComparisonCard from '../shared/ComparisonCard.svelte'; // New import
  import LandingPage from './LandingPage.svelte';

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

  let selectedReviewer = null;

  selectedReviewerStore.subscribe(value => {
    selectedReviewer = value;
    if (selectedReviewer === 'JohnKew') {
      loadData();
    }
  });

  function handleReviewerSelect(event) {
    selectedReviewerStore.set(event.detail);
  }

  async function loadData() {
    const { filteredData: fd, excludedPaddles: ep } = await loadAndProcessData('/radarScores_2024_10_09.csv'); // Correct path to the CSV file
    filteredData = fd;
    excludedPaddles = ep;
    loading = false; // Set loading to false once data is loaded

    // Dispatch the total number of valid paddles to the layout
    window.dispatchEvent(new CustomEvent('getTotalValidPaddles', {
      detail: { callback: (total) => paddlesStore.set(filteredData) }
    }));
  }

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

  // Add this reactive statement to create comparison data
  $: comparisonData = filteredProcessedData.length >= 2 && filteredProcessedData.length <= 3
    ? filteredProcessedData
    : null;
</script>

<style>
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .page-content {
    width: 100%;
    max-width: 1800px;
    margin: 0 auto;
    padding: 0 16px;
  }

  .paddle-count-title {
    text-align: center;
    font-size: 0.75em; /* Reduced from 1em to 0.75em */
    margin: 10px 0 15px; /* Adjusted margins */
    color: #999999; /* Lighter color */
    font-weight: normal; /* Removed boldness */
  }

  .card-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (min-width: 640px) {
    .card-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }
  }

  @media (min-width: 1440px) {
    .card-grid {
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    }
  }

  .in-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 50vh;
    text-align: center;
    color: #fff;
  }

  .in-progress h2 {
    font-size: 2em;
    margin-bottom: 20px;
  }

  .in-progress p {
    font-size: 1.2em;
  }
</style>

{#if selectedReviewer === 'JohnKew'}
  <div class="page-content">
    <div class="paddle-count-title">
      Displaying {filteredProcessedData.length} Paddle{filteredProcessedData.length !== 1 ? 's' : ''}
    </div>

    <div class="card-grid">
      {#if comparisonData}
        <ComparisonCard 
          data={comparisonData}
          xKey={Object.values(labelMapping)}
        />
      {/if}

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

      <SpecialCard {excludedPaddles} />
    </div>
  </div>
{:else}
  <div class="in-progress">
    <h2>In Progress</h2>
    <p>Data for {selectedReviewer} is not yet available. Check back soon!</p>
  </div>
{/if}
