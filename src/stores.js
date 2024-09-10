import { writable } from 'svelte/store';

export const paddlesStore = writable([]);
export const selectedPaddlesStore = writable([]); // New store for selected paddles