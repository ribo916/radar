<script>
    import '../app.css';
    import Modal from '../shared/Modal.svelte'; // Import the Modal component
  
    let showModal = false;
  
    function openModal() {
      showModal = true;
    }
  
    function closeModal() {
      showModal = false;
    }
  </script>
  
  <main>
    <div class="banner">
      <h3>Paddle Comparisons</h3>
      <button class="info-button" on:click={openModal} aria-label="More information">
        <i class="fas fa-info-circle"></i>
      </button>
    </div>
    <div class="chart-grid">
      <slot />
    </div>
  </main>
  
  {#if showModal}
    <Modal on:close={closeModal}>
      <h2>Overview</h2>
      <p>This site merely uses the JohnKew database to regenerate radar charts for quick/easy comparisons.</p>
      <ul>
        <li>Data is hardcoded from JohnKew's site on 9/3/24</li>
      </ul>
    </Modal>
  {/if}
  
  <style>
    main {
      width: 100%;
      height: 100%;
    }
  
    .banner {
      width: 100%;
      background: linear-gradient(90deg, #03c8ff, #0077ff);
      color: white;
      padding: 1px;
      text-align: center;
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      border-radius: 4px;
      font-size: 1.2em;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
  
    .info-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      color: #ccc;
      position: absolute;
      right: 20px; /* Increased spacing from the right */
    }
  
    .chart-grid {
      display: grid;
      gap: 16px; /* Adjust the gap between charts as needed */
      grid-template-columns: repeat(1, 1fr); /* Default to 1 column */
    }
  
    @media (min-width: 600px) {
      .chart-grid {
        grid-template-columns: repeat(2, 1fr); /* 2 columns for small screens */
      }
    }
  
    @media (min-width: 900px) {
      .chart-grid {
        grid-template-columns: repeat(3, 1fr); /* 3 columns for medium screens */
      }
    }
  
    @media (min-width: 1200px) {
      .chart-grid {
        grid-template-columns: repeat(4, 1fr); /* 4 columns for large screens */
      }
    }
  </style>