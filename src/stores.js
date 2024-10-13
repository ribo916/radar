import { writable } from 'svelte/store';

export const paddlesStore = writable([]);
export const selectedPaddlesStore = writable([]);
export const selectedReviewerStore = writable(null);
export const filterValues = writable({
  powerFilter: 0,
  spinFilter: 0,
  popFilter: 0,
  twistFilter: 0,
  balanceFilter: 0,
  swingFilter: 0
});

// New store for PBEffect filters
export const pbEffectFilterValues = writable({
  powerFilter: 0,
  spinFilter: 0,
  popFilter: 0,
  twistFilter: 0,
  swingFilter: 0
});

export const showCompareStore = writable(false);

export const pbEffectSelectedPaddlesStore = writable([]);
export const showPBEffectCompareStore = writable(false);

export const pbStudioSelectedPaddlesStore = writable([]);
export const showPBStudioCompareStore = writable(false);
