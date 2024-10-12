<!-- src/shared/PBEffectCard.svelte -->
<script>
  export let backContent;

  let isFlipped = false;

  function flipCard() {
    isFlipped = !isFlipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  function formatValue(value) {
    return value ? `${parseFloat(value).toFixed(1)}%` : 'N/A';
  }

  function getSpinRatingWidth(rating) {
    switch (rating?.toLowerCase()) {
      case 'very high': return '100%';
      case 'high': return '75%';
      case 'medium': return '50%';
      case 'low': return '25%';
      default: return '0%';
    }
  }

  const percentileFields = [
    { key: 'power_percentile', color: '#4CAF50', label: 'Power' },
    { key: 'pop_percentile', color: '#2196F3', label: 'Pop' },
    { key: 'twist_percentile', color: '#FFC107', label: 'Twist' },
    { key: 'swing_percentile', color: '#9C27B0', label: 'Swing' },
    { key: 'spin_rating', color: '#FF5722', label: 'Spin' }
  ];
</script>

<div class="card {isFlipped ? 'flipped' : ''}" on:click={flipCard} on:keydown={handleKeyDown} role="button" tabindex="0" aria-pressed={isFlipped}>
  <div class="card-inner">
    <div class="card-front">
      <div class="title-banner">{backContent.paddle || 'Unknown Paddle'} - {backContent.thickness || 'N/A'}mm</div>
      <div class="front-content">
        {#each percentileFields as { key, color, label }}
          <div class="percentile-bar">
            <span class="percentile-label">{label}:</span>
            <div class="bar-container">
              {#if key === 'spin_rating'}
                {#if backContent[key]}
                  <div class="bar" style="width: {getSpinRatingWidth(backContent[key])}; background-color: {color};">
                    {backContent[key]}
                  </div>
                {:else}
                  <div class="bar na">N/A</div>
                {/if}
              {:else if backContent[key] && parseFloat(backContent[key]) > 0}
                <div class="bar" style="width: {backContent[key]}%; background-color: {color};">
                  {formatValue(backContent[key])}
                </div>
              {:else}
                <div class="bar na">N/A</div>
              {/if}
            </div>
          </div>
        {/each}
        <i class="fas fa-sync-alt flip-icon"></i>
      </div>
    </div>
    <div class="card-back">
      <div class="title-banner">{backContent.paddle || 'Unknown Paddle'} - {backContent.thickness || 'N/A'}mm</div>
      <div class="back-content">
        <div class="back-content-item">Brand: <span class="value">{backContent.company || 'N/A'}</span></div>
        {#each Object.entries(backContent) as [key, value]}
          {#if !key.includes('percentile') && key !== 'company' && key !== 'paddle' && key !== 'thickness' && key !== 'spin_rating'}
            <div class="back-content-item">{key.replace('_', ' ')}: <span class="value">{value || 'N/A'}</span></div>
          {/if}
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
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .card.flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card-front, .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
    overflow: hidden;
    background-color: #1e1e1e;
    color: white;
    font-size: 0.75em;
  }

  .card-back {
    transform: rotateY(180deg);
    text-align: left;
  }

  .title-banner {
    width: 100%;
    padding: 10px;
    background-color: #333;
    color: white;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #444;
    box-sizing: border-box;
  }

  .front-content, .back-content {
    padding: 20px;
    height: calc(100% - 40px);
    overflow-y: auto;
  }

  .percentile-bar {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .percentile-label {
    width: 60px;
    text-align: left;
    margin-right: 10px;
    font-size: 0.9em;
  }

  .bar-container {
    flex-grow: 1;
    background-color: #444;
    height: 30px;
    border-radius: 15px;
    overflow: hidden;
  }

  .bar {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    font-size: 0.8em;
    color: #fff;
    transition: width 0.3s ease-in-out;
    text-transform: capitalize;
  }

  .bar.na {
    background-color: rgba(102, 102, 102, 0.3); /* Reduced opacity */
    justify-content: center;
    color: rgba(255, 255, 255, 0.5); /* Dimmed text color */
    font-style: italic;
    width: 100%; /* Ensure full width */
  }

  .flip-icon {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 1.5em;
    color: #ccc;
  }

  .back-content-item {
    margin-bottom: 10px;
    font-size: 0.9em;
  }

  .back-content-item .value {
    color: #2196F3; /* This is the blue color used for the Pop percentile bar */
  }
</style>
