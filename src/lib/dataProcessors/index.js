import { loadAndProcessData as processJohnKewData } from './johnKew.js';
// import { processPBStudioData } from './pbStudio.js';
// import { processPBEffectData } from './pbEffect.js';

export async function processData(reviewer, queryParams) {
  switch (reviewer) {
    case 'JohnKew':
      return await processJohnKewData(queryParams);
    // case 'PBStudio':
    //   return await processPBStudioData(dataSource);
    // case 'PBEffect':
    //   return await processPBEffectData(dataSource);
    // Add cases for other reviewers as needed
    default:
      throw new Error(`Unsupported reviewer: ${reviewer}`);
  }
}
