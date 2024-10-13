<script>
  import Card from '../shared/Card.svelte';
  import SpecialCard from '../shared/SpecialCard.svelte';
  import { onMount } from 'svelte';
  import { paddlesStore, selectedPaddlesStore, selectedReviewerStore, filterValues, pbEffectFilterValues } from '../stores.js'; // Import the stores
  import { processData } from '$lib/dataProcessors'; // New import
  import ComparisonCard from '../shared/ComparisonCard.svelte'; // New import
  import LandingPage from './LandingPage.svelte';
  import { page } from '$app/stores';
  import PBEffectCard from '../shared/PBEffectCard.svelte';
  import { showPBEffectCompareStore } from '../stores.js';
  import PBEffectCompareSection from '../shared/PBEffectCompareSection.svelte';
  import { pbEffectSelectedPaddlesStore } from '../stores.js';

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
  let loading = true;
  let selectedReviewer = null;
  let totalValidPaddleCount = 0;
  let selectedPaddles = [];
  let dataError = false;

  selectedReviewerStore.subscribe(value => {
    selectedReviewer = value;
    if (selectedReviewer === 'JohnKew') {
      loadJohnKewData();
    } else if (selectedReviewer === 'PBEffect') {
      loadPBEffectData();
    } else if (selectedReviewer === 'PBStudio') {
      loadPBStudioData();
    }
  });

  selectedPaddlesStore.subscribe(value => {
    selectedPaddles = value;
  });

  // Move all reactive statements to the top level
  $: ({ powerFilter, spinFilter, popFilter, twistFilter, balanceFilter, swingFilter } = $filterValues);

  $: processedData = selectedReviewer === 'JohnKew'
    ? filteredData.map(record => {
        const newRecord = {};
        for (const key in record) {
          if (labelMapping[key]) {
            newRecord[labelMapping[key]] = record[key];
          } else {
            newRecord[key] = record[key];
          }
        }
        return newRecord;
      })
    : filteredData; // For PBEffect and other reviewers, use filteredData as is

  let pbEffectSelectedPaddles = [];
  pbEffectSelectedPaddlesStore.subscribe(value => {
    pbEffectSelectedPaddles = value;
  });

  $: filteredProcessedData = selectedReviewer === 'JohnKew'
    ? processedData.filter(record => 
        record.Power * 10 > $filterValues.powerFilter &&
        record.Spin * 10 > $filterValues.spinFilter &&
        record.Pop * 10 > $filterValues.popFilter &&
        record.Twist * 10 > $filterValues.twistFilter &&
        record.Balance * 10 > $filterValues.balanceFilter &&
        record.Swing * 10 > $filterValues.swingFilter &&
        (selectedPaddles.length === 0 || selectedPaddles.some(p => p.paddle === record[seriesKey] && p.company === record.company && p.thickness === record.thickness))
      )
    : selectedReviewer === 'PBEffect'
      ? processedData.filter(paddle => {
          const spinFilterIndex = Math.floor($pbEffectFilterValues.spinFilter / 25);
          const spinFilterLevel = spinLevels[spinFilterIndex];
          const paddleSpinRating = paddle.spin_rating ? paddle.spin_rating.trim().toLowerCase() : '';
          const spinFilterPasses = spinFilterIndex === 0 || paddleSpinRating === spinFilterLevel;

          // Apply existing PBEffect filters
          const existingFiltersPassed = (
            ($pbEffectFilterValues.powerFilter === 0 || 
             (paddle.power_percentile != null && parseFloat(paddle.power_percentile) > $pbEffectFilterValues.powerFilter)) &&
            ($pbEffectFilterValues.popFilter === 0 || 
             (paddle.pop_percentile != null && parseFloat(paddle.pop_percentile) > $pbEffectFilterValues.popFilter)) &&
            ($pbEffectFilterValues.twistFilter === 0 || 
             (paddle.twist_percentile != null && parseFloat(paddle.twist_percentile) > $pbEffectFilterValues.twistFilter)) &&
            ($pbEffectFilterValues.swingFilter === 0 || 
             (paddle.swing_percentile != null && parseFloat(paddle.swing_percentile) > $pbEffectFilterValues.swingFilter)) &&
            spinFilterPasses
          );

          // Apply compare filter
          const compareFilterPassed = pbEffectSelectedPaddles.length === 0 || 
            pbEffectSelectedPaddles.some(p => 
              p.company === paddle.company && 
              p.paddle === paddle.paddle && 
              p.thickness === paddle.thickness
            );

          return existingFiltersPassed && compareFilterPassed;
        })
      : processedData;

  $: if (typeof window !== 'undefined') {
    const event = new CustomEvent('updateFilteredPaddlesCount', {
      detail: {
        count: filteredProcessedData.length
      }
    });
    window.dispatchEvent(event);
  }

  $: paddlesStore.set(filteredProcessedData);

  $: comparisonData = filteredProcessedData.length >= 2 && filteredProcessedData.length <= 3
    ? filteredProcessedData
    : null;

  let dataDate = {
    JohnKew: '10/09/2024',
    PBEffect: '10/11/2024',
    PBStudio: '10/11/2024'
  };

  function handleReviewerSelect(event) {
    selectedReviewerStore.set(event.detail);
  }

  async function loadJohnKewData() {
    loading = true;
    dataError = false;
    try {
      const { filteredData: fd, excludedPaddles: ep } = await processData('JohnKew', $page.url.searchParams);
      filteredData = fd;
      excludedPaddles = ep;
      totalValidPaddleCount = fd.length;
      loading = false;

      // Dispatch the total number of valid paddles to the layout
      window.dispatchEvent(new CustomEvent('getTotalValidPaddles', {
        detail: { callback: (total) => paddlesStore.set(filteredData) }
      }));
    } catch (error) {
      console.error('Error loading JohnKew data:', error);
      dataError = true;
      loading = false;
    }
  }

  async function loadPBEffectData() {
    loading = true;
    dataError = false;
    try {
      const { filteredData: fd, excludedPaddles: ep } = await processData('PBEffect', $page.url.searchParams);
      filteredData = fd;
      excludedPaddles = ep;
      totalValidPaddleCount = fd.length;
      loading = false;
    } catch (error) {
      console.error('Error loading PBEffect data:', error);
      dataError = true;
      loading = false;
    }
  }

  async function loadPBStudioData() {
    loading = true;
    dataError = false;
    try {
      const { filteredData: fd, excludedPaddles: ep } = await processData('PBStudio', $page.url.searchParams);
      filteredData = fd;
      excludedPaddles = ep;
      totalValidPaddleCount = fd.length;
      loading = false;
    } catch (error) {
      console.error('Error loading PBStudio data:', error);
      dataError = true;
      loading = false;
    }
  }

  const spinLevels = ['', 'low', 'medium', 'high', 'very high'];
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
    position: relative; /* Add this line */
  }

  .paddle-count-title {
    text-align: center;
    font-size: 0.75em;
    margin: 10px 0 15px;
    color: #999999;
    font-weight: normal;
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
    color: #ff3e00;
    font-size: 1.2em;
    margin: 5px 0;
    padding: 0;
  }

  .in-progress h2 {
    font-size: 2em;
    margin-bottom: 20px;
  }

  .in-progress p {
    font-size: 1.2em;
  }

  .loading {
    text-align: center;
    font-size: 1.2em;
    margin-top: 20px;
  }

  .error {
    color: red;
    text-align: center;
    font-size: 1.2em;
    margin-top: 10px;
  }

  .centered {
    text-align: center;
  }

</style>

{#if !selectedReviewer}
  <LandingPage on:select={handleReviewerSelect} />
{:else if loading}
  <div class="loading">Loading {selectedReviewer} data...</div>
{:else if dataError}
  <div class="error">Error loading data for {selectedReviewer}. Please try again later.</div>
{:else if selectedReviewer === 'JohnKew'}
  <div class="page-content">
    <div class="paddle-count-title">
      Displaying {filteredProcessedData.length}/{totalValidPaddleCount} paddles (Data as of: {dataDate[selectedReviewer]})
    </div>

    <div class="card-grid">
      {#if comparisonData}
        <ComparisonCard 
          data={comparisonData.map(record => ({...record}))}
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
            balancePointCM: record.balance_point_cm,
            ...Object.fromEntries(
              Object.entries(record).filter(([key]) => 
                !['Power', 'Spin', 'Twist', 'Balance', 'Swing', 'Pop', 'shape', 'face_material', 'handle_length', 'spin_rpm', 'serve_speed_mph', 'punch_volley_speed', 'swing_weight', 'twist_weight', 'core_material', 'surface_texture', 'length', 'width', 'static_weight', 'balance_point_cm'].includes(key)
              )
            )
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
{:else if selectedReviewer === 'PBEffect'}
  <div class="page-content">
    {#if $showPBEffectCompareStore}
      <PBEffectCompareSection paddles={processedData} />
    {/if}
    <div class="paddle-count-title">
      Displaying {filteredProcessedData.length}/{totalValidPaddleCount} paddles (Data as of: {dataDate[selectedReviewer] || 'Unknown Date'})
    </div>
    <div class="card-grid">
      {#each filteredProcessedData as paddle}
        <PBEffectCard backContent={paddle} />
      {/each}
    </div>
  </div>
{:else if selectedReviewer === 'PBStudio'}
  <div class="page-content centered">
    <p>In Progress</p>
    <p>Total paddles in {selectedReviewer} dataset: {totalValidPaddleCount}</p>
    <p>Data as of: {dataDate[selectedReviewer]}</p>
  </div>
{:else}
  <div class="in-progress">
    <h2>In Progress</h2>
    <p>Data for {selectedReviewer} is not yet available. Check back soon!</p>
  </div>
{/if}