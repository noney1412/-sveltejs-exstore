import { writable } from 'svelte/store';
import type { ExSlice, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	const actions = slice.actions?.(initialValue) as WrappedActions;

	// can't use Object.entries() if primitive initialValue
	if (actions !== undefined) {
		for (const key in actions) {
			const fn = actions[key] as any;
			actions[key as keyof WrappedActions] = function (...args: unknown[]) {
				update((state) => {
					return fn(...args) ?? state;
				});
			};
		}
	}

	return { subscribe, update, set, ...actions };
}

export default exStore;
