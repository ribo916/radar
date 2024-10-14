import { processData as processJohnKewData } from './johnKew.js';
import { processData as processPBEffectData } from './pbEffect.js';
import { processData as processPBStudioData } from './pbStudio.js';

export function processData(reviewer) {
  switch (reviewer) {
    case 'JohnKew':
      return processJohnKewData();
    case 'PBEffect':
      return processPBEffectData();
    case 'PBStudio':
      return processPBStudioData();
    default:
      console.log(`Data processing not implemented for reviewer: ${reviewer}`);
      return Promise.resolve({ filteredData: [], excludedPaddles: [] });
  }
}
