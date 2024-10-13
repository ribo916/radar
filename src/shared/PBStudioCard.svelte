<script>
  export let paddleData;

  let isFlipped = false;
  let focusedBubble = null;

  function flipCard() {
    isFlipped = !isFlipped;
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      flipCard();
    }
  }

  function setFocus(index) {
    focusedBubble = index;
  }

  function clearFocus() {
    focusedBubble = null;
  }

  const frontParameters = [
    { key: 'swing_weight', label: 'Swing Weight', color: '#9C27B0' },
    { key: 'twist_weight', label: 'Twist Weight', color: '#009688' },
    { key: 'balance_point', label: 'Balance', color: '#2196F3' },
    { key: 'spin_rpm', label: 'Spin RPM', color: '#D32F2F' }
  ];

  function formatKey(key) {
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
</script>

<div class="card {isFlipped ? 'flipped' : ''}" on:click={flipCard} on:keydown={handleKeyDown} role="button" tabindex="0" aria-pressed={isFlipped}>
  <div class="card-inner">
    <div class="card-front">
      <div class="title-banner">{paddleData.paddle || 'Unknown Paddle'} - {paddleData.thickness || 'N/A'}mm</div>
      <div class="front-content">
        <div class="parameters-layout" class:has-focus={focusedBubble !== null}>
          {#each frontParameters as { key, label, color }, index}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div 
              class="parameter-bubble" 
              style="background-color: {color}; --index: {index};"
              on:mouseenter={() => setFocus(index)}
              on:mouseleave={clearFocus}
              class:focused={focusedBubble === index}
            >
              <div class="value">{paddleData[key] || 'N/A'}</div>
              <div class="label">{label}</div>
            </div>
          {/each}
        </div>
      </div>
      <i class="fas fa-sync-alt flip-icon"></i>
    </div>
    <div class="card-back">
      <div class="title-banner">{paddleData.paddle || 'Unknown Paddle'} - {paddleData.thickness || 'N/A'}mm</div>
      <div class="back-content">
        {#each Object.entries(paddleData) as [key, value]}
          <div class="back-content-item">
            {formatKey(key)}:
            <span class="value">
              {#if key === 'link_to_paddle' || key === 'youtube_review'}
                {#if value}
                  <a href={value} target="_blank" rel="noopener noreferrer">Link</a>
                {:else}
                  N/A
                {/if}
              {:else}
                {value || 'N/A'}
              {/if}
            </span>
          </div>
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
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    background-color: #1e1e1e;
    color: white;
    display: flex;
    flex-direction: column;
    font-size: 0.75em; /* Match PBEffect card font size */
  }

  .card-back {
    transform: rotateY(180deg);
    text-align: left; /* Align text to the left like PBEffect */
  }

  .title-banner {
    background-color: #333;
    padding: 10px;
    font-size: 15px; /* Match PBEffect title font size */
    font-weight: bold;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    text-align: center; /* Center the text like PBEffect */
    border-bottom: 1px solid #444; /* Add a bottom border like PBEffect */
    box-sizing: border-box;
  }

  .front-content, .back-content {
    padding: 20px;
    flex-grow: 1;
    overflow-y: auto;
    height: calc(100% - 40px); /* Subtract the height of the title banner */
  }

  .parameters-layout {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .parameter-bubble {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 110px;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  }

  .parameter-bubble:nth-child(1) { top: 10%; left: 50%; transform: translateX(-50%); }
  .parameter-bubble:nth-child(2) { top: 50%; left: 10%; transform: translateY(-50%); }
  .parameter-bubble:nth-child(3) { top: 50%; right: 10%; transform: translateY(-50%); }
  .parameter-bubble:nth-child(4) { bottom: 10%; left: 50%; transform: translateX(-50%); }

  .parameter-bubble:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
    z-index: 1;
  }

  .parameter-bubble:nth-child(1):hover { transform: translateX(-50%) scale(1.03); }
  .parameter-bubble:nth-child(2):hover { transform: translateY(-50%) scale(1.03); }
  .parameter-bubble:nth-child(3):hover { transform: translateY(-50%) scale(1.03); }
  .parameter-bubble:nth-child(4):hover { transform: translateX(-50%) scale(1.03); }

  .parameters-layout.has-focus .parameter-bubble:not(.focused) {
    filter: grayscale(80%) brightness(0.8);
  }

  .parameter-bubble .value {
    font-size: 1.2em;
    font-weight: bold;
    color: #fff;
    margin-bottom: 5px;
  }

  .parameter-bubble .label {
    font-size: 0.9em;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }

  .back-content-item {
    margin-bottom: 10px;
    font-size: 0.9em;
    text-align: left;
  }

  .back-content-item {
    color: #20e87a;
    font-weight: bold;
  }

  .back-content-item .value {
    color: #ffffff;
    font-weight: normal;
  }

  .back-content-item a {
    color: #2196F3;
    text-decoration: none;
  }

  .back-content-item a:hover {
    text-decoration: underline;
  }

  .flip-icon {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 1.5em;
    color: #ccc;
    z-index: 2; /* Ensure the icon is above other elements */
  }
</style>
