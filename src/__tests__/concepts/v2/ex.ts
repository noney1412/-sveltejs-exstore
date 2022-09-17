import { writable } from 'svelte/store';
import { initSharedState } from './factories/initState';
import type { ExSlice } from './types/ExSlice';

export function ex<State>(slice: ExSlice<State>) {
	// extract state from slice.
	const $state = initSharedState(slice);

	const store = writable(($state as any).$init);

	return store;
}
