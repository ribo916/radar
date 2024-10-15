<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    function selectReviewer(reviewer) {
      dispatch('select', reviewer);
    }
  </script>
  
  <div class="landing-page">
    <h1>Welcome to Pickleball Paddle Stats</h1>
    <p>Select a reviewer from the options above to view paddle data.</p>
    <div class="disclaimer">
      <p><em>Disclaimer: This site aggregates public data shared by each reviewer and presents it for easier consumption. All credit for the data goes to the original reviewers.</em></p>
    </div>
  </div>
  
  <style>
    .landing-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: calc(100vh - 100px); /* Adjust this value based on your header height */
      text-align: center;
      padding: 0 20px;
    }

    h1 {
      font-size: 2em;
      margin-bottom: 20px;
      color: #ffffff;
    }

    p {
      font-size: 1.2em;
      margin-bottom: 20px;
      color: #e0e0e0;
    }

    .disclaimer {
      max-width: 600px;
      margin-top: 20px;
      padding: 15px;
      border: 1px solid #444;
      border-radius: 5px;
      background-color: rgba(50, 50, 50, 0.7);
    }

    .disclaimer p {
      font-size: 0.9em;
      color: #bbb;
      margin: 0;
    }
  </style>
