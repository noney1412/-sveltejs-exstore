import { Writable, writable } from 'svelte/store';
import { bindActions, getCurrentState, initSharedState } from './factories/initSharedState';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc } from './types/Utils';

export function ex<State>(slice: ExSlice<State>) {
	const state = initSharedState(slice);

	const actions = bindActions(state.bind, slice);

	const store = writable(state.initialState);

	const boundActions = Object.keys(actions).reduce((acc, key) => {
		const fn = actions[key];
		acc[key] = function (...args: unknown[]) {
			beforeUpdateSate();
			updateState();
			afterUpdateSate();

			function beforeUpdateSate() {
				//..
			}

			function updateState() {
				store.update((prev) => {
					fn.apply(prev, args);
					const newState = getCurrentState(state);
					return newState;
				});
			}

			function afterUpdateSate() {
				//..
			}
		};
		return acc;
	}, {}) as OnlyFunc<State>;

	return { ...store, ...boundActions, ...state } as OnlyFunc<State> &
		Writable<typeof state.initialState>;
}
