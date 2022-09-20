import { Writable, writable } from 'svelte/store';
import { bindActions, getCurrentState, initSharedState } from './factories/initSharedState';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc, OnlyState } from './types/Utils';

export function ex<State>(slice: ExSlice<State>) {
	const state = initSharedState(slice);

	const actions = bindActions(state.bind, slice);

	const store = writable(state.initialState);

	const wrappedSet = (value: typeof state.initialState) => {
		if (state.mode === 'primitive') {
			(state as typeof state & { bind: { $init: unknown } }).bind.$init = value;
		} else {
			state.bind = value as OnlyState<State>;
		}
		store.set(value);
	};

	const wrappedUpdate = (fn: (value: typeof state.initialState) => typeof state.initialState) => {
		const value = fn(getCurrentState(state));
		wrappedSet(value);
	};

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

	return {
		subscribe: store.subscribe,
		set: wrappedSet,
		update: wrappedUpdate,
		...boundActions
	} as OnlyFunc<State> & Writable<typeof state.initialState>;
}
