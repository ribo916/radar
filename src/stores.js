import { writable } from 'svelte/store';

export const paddlesStore = writable([]);
export const selectedPaddlesStore = writable([]);
export const selectedReviewerStore = writable(null);
