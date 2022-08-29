import type { Writable } from 'svelte/store';

/**
 * ExStore is a Svelte Store that can be used to create Redux-like stores.
 * with the integration of ExStoreEnhancer for example, the Redux DevTools extension.
 */
export type ExStore<T> = Writable<T> & ExSlice<T>;
