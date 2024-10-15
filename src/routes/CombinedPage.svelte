<script>
  import { onMount } from 'svelte';
  import { processData as processJohnKewData } from '$lib/dataProcessors/johnKew.js';
  import { processData as processPBEffectData } from '$lib/dataProcessors/pbEffect.js';
  import { processData as processPBStudioData } from '$lib/dataProcessors/pbStudio.js';

  let combinedData = [];
  let sortedPotentiallyRelated = [];
  let sortedDefinitelyUniqueJK = [];
  let sortedDefinitelyUniquePE = [];
  let sortedDefinitelyUniquePS = [];
  let analytics = {
    total: 0,
    inAllThree: 0,
    potentiallyRelated: 0,
    potentiallyRelatedJK: 0,
    potentiallyRelatedPE: 0,
    potentiallyRelatedPS: 0,
    definitelyUniqueJK: 0,
    definitelyUniquePE: 0,
    definitelyUniquePS: 0
  };

  let openSections = {
    allThree: false,
    potentiallyRelated: false,
    uniqueJK: false,
    uniquePE: false,
    uniquePS: false
  };

  function toggleSection(section, event) {
    if (event.type === 'click' || (event.type === 'keydown' && (event.key === 'Enter' || event.key === ' '))) {
      openSections[section] = !openSections[section];
    }
  }

  function normalizeCompanyName(name) {
    return name?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || '';
  }

  function normalizePaddleName(name) {
    return name?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || '';
  }

  function mergeData(johnKewData, pbEffectData, pbStudioData) {
    const mergedData = {};

    function addPaddle(paddle, source) {
      const key = `${normalizeCompanyName(paddle.company)}_${normalizePaddleName(paddle.paddle)}`;
      if (!mergedData[key]) {
        mergedData[key] = { johnKew: null, pbEffect: null, pbStudio: null };
      }
      mergedData[key][source] = paddle;
    }

    johnKewData.forEach(paddle => addPaddle(paddle, 'johnKew'));
    pbEffectData.forEach(paddle => addPaddle(paddle, 'pbEffect'));
    pbStudioData.forEach(paddle => addPaddle(paddle, 'pbStudio'));

    return Object.values(mergedData);
  }

  function calculateAnalytics(data) {
    analytics.total = data.length;
    data.forEach(paddle => {
      const count = [paddle.johnKew, paddle.pbEffect, paddle.pbStudio].filter(Boolean).length;
      if (count === 3) analytics.inAllThree++;
      else if (count === 2) {
        analytics.inTwo++;
        if (paddle.johnKew && paddle.pbEffect) analytics.jkPe++;
        if (paddle.johnKew && paddle.pbStudio) analytics.jkPs++;
        if (paddle.pbEffect && paddle.pbStudio) analytics.pePs++;
      }
      else if (count === 1) {
        analytics.inOne++;
        if (paddle.johnKew) analytics.jkOnly++;
        if (paddle.pbEffect) analytics.peOnly++;
        if (paddle.pbStudio) analytics.psOnly++;
      }
    });
  }

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeString(str) {
    return removeDiacritics(str?.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') || '');
  }

  function isPotentiallyRelated(paddleA, paddleB) {
    const companyA = normalizeString(paddleA.johnKew?.company || paddleA.pbEffect?.company || paddleA.pbStudio?.company);
    const companyB = normalizeString(paddleB.johnKew?.company || paddleB.pbEffect?.company || paddleB.pbStudio?.company);
    
    if (companyA !== companyB) return false;

    const nameA = normalizeString(paddleA.johnKew?.paddle || paddleA.pbEffect?.paddle || paddleA.pbStudio?.paddle);
    const nameB = normalizeString(paddleB.johnKew?.paddle || paddleB.pbEffect?.paddle || paddleB.pbStudio?.paddle);
    
    // Remove common suffixes and prefixes
    const cleanNameA = nameA.replace(/(control|power|spin|[0-9]+[sxveh]?)+$/g, '').trim();
    const cleanNameB = nameB.replace(/(control|power|spin|[0-9]+[sxveh]?)+$/g, '').trim();
    
    return cleanNameA === cleanNameB || cleanNameA.includes(cleanNameB) || cleanNameB.includes(cleanNameA);
  }

  function groupRelatedPaddles(paddles) {
    const groups = {};
    paddles.forEach(paddle => {
      const key = normalizeString(paddle.johnKew?.company || paddle.pbEffect?.company || paddle.pbStudio?.company);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(paddle);
    });

    const potentiallyRelated = [];
    const definitelyUniqueJK = [];
    const definitelyUniquePE = [];
    const definitelyUniquePS = [];

    Object.values(groups).forEach(companyPaddles => {
      const relatedGroups = [];
      companyPaddles.forEach(paddle => {
        let found = false;
        for (let group of relatedGroups) {
          if (group.some(p => isPotentiallyRelated(p, paddle))) {
            group.push(paddle);
            found = true;
            break;
          }
        }
        if (!found) {
          relatedGroups.push([paddle]);
        }
      });

      relatedGroups.forEach(group => {
        if (group.length > 1 || group[0].johnKew && group[0].pbEffect || group[0].johnKew && group[0].pbStudio || group[0].pbEffect && group[0].pbStudio) {
          potentiallyRelated.push(...group);
        } else {
          const paddle = group[0];
          if (paddle.johnKew) definitelyUniqueJK.push(paddle);
          else if (paddle.pbEffect) definitelyUniquePE.push(paddle);
          else if (paddle.pbStudio) definitelyUniquePS.push(paddle);
        }
      });
    });

    return { potentiallyRelated, definitelyUniqueJK, definitelyUniquePE, definitelyUniquePS };
  }

  function sortPaddles(paddles) {
    return paddles.sort((a, b) => {
      const companyA = normalizeString(a.johnKew?.company || a.pbEffect?.company || a.pbStudio?.company);
      const companyB = normalizeString(b.johnKew?.company || b.pbEffect?.company || b.pbStudio?.company);
      const paddleA = normalizeString(a.johnKew?.paddle || a.pbEffect?.paddle || a.pbStudio?.paddle);
      const paddleB = normalizeString(b.johnKew?.paddle || b.pbEffect?.paddle || b.pbStudio?.paddle);
      
      if (companyA < companyB) return -1;
      if (companyA > companyB) return 1;
      if (paddleA < paddleB) return -1;
      if (paddleA > paddleB) return 1;
      return 0;
    });
  }

  $: {
    if (combinedData.length > 0) {
      const remainingPaddles = combinedData.filter(p => [p.johnKew, p.pbEffect, p.pbStudio].filter(Boolean).length < 3);
      const { potentiallyRelated, definitelyUniqueJK, definitelyUniquePE, definitelyUniquePS } = groupRelatedPaddles(remainingPaddles);
      sortedPotentiallyRelated = sortPaddles(potentiallyRelated);
      sortedDefinitelyUniqueJK = sortPaddles(definitelyUniqueJK);
      sortedDefinitelyUniquePE = sortPaddles(definitelyUniquePE);
      sortedDefinitelyUniquePS = sortPaddles(definitelyUniquePS);

      // Update analytics
      analytics.total = combinedData.length;
      analytics.inAllThree = combinedData.length - remainingPaddles.length;
      analytics.potentiallyRelated = sortedPotentiallyRelated.length;
      analytics.potentiallyRelatedJK = sortedPotentiallyRelated.filter(p => p.johnKew).length;
      analytics.potentiallyRelatedPE = sortedPotentiallyRelated.filter(p => p.pbEffect).length;
      analytics.potentiallyRelatedPS = sortedPotentiallyRelated.filter(p => p.pbStudio).length;
      analytics.definitelyUniqueJK = sortedDefinitelyUniqueJK.length;
      analytics.definitelyUniquePE = sortedDefinitelyUniquePE.length;
      analytics.definitelyUniquePS = sortedDefinitelyUniquePS.length;
    }
  }

  onMount(async () => {
    const johnKewData = await processJohnKewData();
    const pbEffectData = await processPBEffectData();
    const pbStudioData = await processPBStudioData();

    combinedData = mergeData(johnKewData.filteredData, pbEffectData.filteredData, pbStudioData.filteredData);
    calculateAnalytics(combinedData);
    console.log('Combined Data:', combinedData);
    console.log('Analytics:', analytics);
  });

  function formatSwingWeight(value) {
    if (typeof value === 'number') {
      return value.toFixed(2);
    } else if (typeof value === 'string') {
      const numValue = parseFloat(value);
      return isNaN(numValue) ? value : numValue.toFixed(2);
    } else {
      return 'N/A';
    }
  }

  function getDatasetInfo(paddle) {
    let info = [];
    if (paddle.pbStudio) info.push('PS');
    if (paddle.johnKew) info.push('JK');
    if (paddle.pbEffect) info.push('PE');
    return info.join(', ');
  }
</script>

<div class="combined-page">
  <h2>Combined Paddle Reviews Analytics</h2>
  <p class="explanation"><em>Data across reviewers not normalized and even naming is off. This page breaks down what we can determine programmatically.</em></p>
  
  <div class="analytics">
    <p>Total Unique Paddles: {analytics.total}</p>
    <p>Paddles in All Three Datasets: {analytics.inAllThree}</p>
    <p>Potentially Related Paddles: {analytics.potentiallyRelated}</p>
    <ul>
      <li>JohnKew: {analytics.potentiallyRelatedJK}</li>
      <li>PBEffect: {analytics.potentiallyRelatedPE}</li>
      <li>PBStudio: {analytics.potentiallyRelatedPS}</li>
    </ul>
    <p>Definitely Unique Paddles:</p>
    <ul>
      <li>JohnKew: {analytics.definitelyUniqueJK}</li>
      <li>PBEffect: {analytics.definitelyUniquePE}</li>
      <li>PBStudio: {analytics.definitelyUniquePS}</li>
    </ul>
  </div>

  <div class="collapsible-section">
    <button
      class="section-header"
      on:click={(e) => toggleSection('allThree', e)}
      on:keydown={(e) => toggleSection('allThree', e)}
      aria-expanded={openSections.allThree}
      aria-controls="allThree-content"
    >
      <h3>Paddles in All Three Datasets</h3>
      <span class="toggle-icon">{openSections.allThree ? '▼' : '▶'}</span>
    </button>
    <div id="allThree-content" class="table-container" class:hidden={!openSections.allThree}>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Paddle</th>
          </tr>
        </thead>
        <tbody>
          {#each combinedData.filter(p => p.johnKew && p.pbEffect && p.pbStudio) as paddle}
            <tr>
              <td>{paddle.johnKew.company}</td>
              <td>{paddle.johnKew.paddle}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="collapsible-section">
    <button
      class="section-header"
      on:click={(e) => toggleSection('potentiallyRelated', e)}
      on:keydown={(e) => toggleSection('potentiallyRelated', e)}
      aria-expanded={openSections.potentiallyRelated}
      aria-controls="potentiallyRelated-content"
    >
      <h3>Potentially Related Paddles</h3>
      <span class="toggle-icon">{openSections.potentiallyRelated ? '▼' : '▶'}</span>
    </button>
    <div id="potentiallyRelated-content" class="table-container" class:hidden={!openSections.potentiallyRelated}>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Paddle</th>
            <th>Datasets</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedPotentiallyRelated as paddle}
            <tr>
              <td>{paddle.johnKew?.company || paddle.pbEffect?.company || paddle.pbStudio?.company}</td>
              <td>{paddle.johnKew?.paddle || paddle.pbEffect?.paddle || paddle.pbStudio?.paddle}</td>
              <td>{getDatasetInfo(paddle)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="collapsible-section">
    <button
      class="section-header"
      on:click={(e) => toggleSection('uniqueJK', e)}
      on:keydown={(e) => toggleSection('uniqueJK', e)}
      aria-expanded={openSections.uniqueJK}
      aria-controls="uniqueJK-content"
    >
      <h3>Definitely Unique Paddles - JohnKew</h3>
      <span class="toggle-icon">{openSections.uniqueJK ? '▼' : '▶'}</span>
    </button>
    <div id="uniqueJK-content" class="table-container" class:hidden={!openSections.uniqueJK}>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Paddle</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedDefinitelyUniqueJK as paddle}
            <tr>
              <td>{paddle.johnKew.company}</td>
              <td>{paddle.johnKew.paddle}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="collapsible-section">
    <button
      class="section-header"
      on:click={(e) => toggleSection('uniquePE', e)}
      on:keydown={(e) => toggleSection('uniquePE', e)}
      aria-expanded={openSections.uniquePE}
      aria-controls="uniquePE-content"
    >
      <h3>Definitely Unique Paddles - PBEffect</h3>
      <span class="toggle-icon">{openSections.uniquePE ? '▼' : '▶'}</span>
    </button>
    <div id="uniquePE-content" class="table-container" class:hidden={!openSections.uniquePE}>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Paddle</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedDefinitelyUniquePE as paddle}
            <tr>
              <td>{paddle.pbEffect.company}</td>
              <td>{paddle.pbEffect.paddle}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <div class="collapsible-section">
    <button
      class="section-header"
      on:click={(e) => toggleSection('uniquePS', e)}
      on:keydown={(e) => toggleSection('uniquePS', e)}
      aria-expanded={openSections.uniquePS}
      aria-controls="uniquePS-content"
    >
      <h3>Definitely Unique Paddles - PBStudio</h3>
      <span class="toggle-icon">{openSections.uniquePS ? '▼' : '▶'}</span>
    </button>
    <div id="uniquePS-content" class="table-container" class:hidden={!openSections.uniquePS}>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Paddle</th>
          </tr>
        </thead>
        <tbody>
          {#each sortedDefinitelyUniquePS as paddle}
            <tr>
              <td>{paddle.pbStudio.company}</td>
              <td>{paddle.pbStudio.paddle}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>

<style>
  .combined-page {
    padding: 20px;
    color: white;
    max-width: 100%;
    overflow-x: hidden;
  }

  .analytics {
    background-color: #333;
    padding: 15px;
    border-radius: 5px;
    margin-bottom: 20px;
  }

  .collapsible-section {
    margin-bottom: 20px;
  }

  .section-header {
    background-color: #444;
    padding: 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    border: none;
    color: white;
    text-align: left;
  }

  .section-header:hover {
    background-color: #555;
  }

  .section-header h3 {
    margin: 0;
    font-size: 1em;
  }

  .toggle-icon {
    font-size: 1.2em;
  }

  .table-container {
    overflow-x: auto;
    margin-top: 10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9em;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #333;
  }

  .hidden {
    display: none;
  }

  @media (max-width: 600px) {
    table {
      font-size: 0.8em;
    }

    th, td {
      padding: 6px;
    }
  }

  .explanation {
    font-size: 0.9em;
    margin-bottom: 20px;
    color: #ccc;  /* A lighter color to differentiate from the main content */
  }
</style>