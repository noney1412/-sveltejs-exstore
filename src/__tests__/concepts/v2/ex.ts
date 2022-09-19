import { Writable, writable } from 'svelte/store';
import { bindActions, initSharedState } from './factories/initSharedState';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc } from './types/Utils';

export function ex<State>(slice: ExSlice<State>) {
	// extract state from slice.
	const state = initSharedState(slice);

	const actions = bindActions(state.bind, slice);

	const store = writable(state.initialState);

	return { ...store, ...actions, ...state } as OnlyFunc<State> &
		Writable<typeof state.initialState>;
}
