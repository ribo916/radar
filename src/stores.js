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
  popFilter: 0,
  twistFilter: 0,
  swingFilter: 0,
  spinFilter: 0
});
