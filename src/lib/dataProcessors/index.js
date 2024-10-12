import { processData as processJohnKewData } from './johnKew.js';
import { processData as processPBEffectData } from './pbEffect.js';
import { processData as processPBStudioData } from './pbStudio.js';

export function processData(reviewer, searchParams) {
  switch (reviewer) {
    case 'JohnKew':
      return processJohnKewData(searchParams);
    case 'PBEffect':
      return processPBEffectData(searchParams);
    case 'PBStudio':
      return processPBStudioData(searchParams);
    default:
      console.log(`Data processing not implemented for reviewer: ${reviewer}`);
      return Promise.resolve({ filteredData: [], excludedPaddles: [] });
  }
}
