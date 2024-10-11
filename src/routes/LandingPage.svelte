<script>
    import { createEventDispatcher } from 'svelte';
  
    const dispatch = createEventDispatcher();
  
    function selectReviewer(reviewer) {
      dispatch('select', reviewer);
    }
  </script>
  
  <div class="landing-page">
    <h1>Welcome to Pickleball Paddle Charts</h1>
    <p>Select a reviewer to view paddle data:</p>
    <button on:click={() => selectReviewer('JohnKew')}>JohnKew</button>
  </div>
  
  <style>
    .landing-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    }
  
    button {
      margin-top: 20px;
      padding: 10px 20px;
      font-size: 1em;
      cursor: pointer;
    }
  </style>