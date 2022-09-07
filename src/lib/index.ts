import produce from 'immer';
import { writable } from 'svelte/store';
import type { ExSlice, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	const actions = slice.actions?.(initialValue) as WrappedActions;

	console.log(actions);

	// can't use Object.entries() if primitive initialValue
	if (actions !== undefined) {
		for (const key in actions) {
			const fn = actions[key] as any;
			actions[key as keyof WrappedActions] = function (...args: unknown[]) {
				console.log(fn);
				update((state) => {
					fn(...args);
					console.log('what is the state', state);
					return state;
				});
			};
		}
	}

	return { subscribe, update, set, ...actions };
}

export default exStore;
