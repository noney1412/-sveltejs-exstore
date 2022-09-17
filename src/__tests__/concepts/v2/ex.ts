import { writable } from 'svelte/store';
import { initState } from './factories/initState';
import type { ExSlice } from './types/ExSlice';

export function ex<State>(slice: ExSlice<State>) {
	// extract state from slice.
	const $state = initState(slice);

	const store = writable(($state as any).$init);

	return store;
}
