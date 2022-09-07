import { get, writable } from 'svelte/store';
import type { ExSlice, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const store = writable<InitialValue<State>>(initialValue);
	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	const actions = slice.actions?.(initialValue, store.update) as WrappedActions;

	if (actions !== undefined) {
		if (initialValue !== Object(initialValue)) {
			for (const key in actions) {
				const fn = actions[key] as any;
				actions[key as keyof WrappedActions] = function (...args: unknown[]) {
					const result = fn(...args);
					return result;
				};
			}
		} else {
			for (const key in actions) {
				const fn = actions[key] as any;
				actions[key as keyof WrappedActions] = function (...args: unknown[]) {
					store.update((state) => {
						fn(...args);
						return state;
					});
				};
			}
		}
	}

	return { subscribe: store.subscribe, update: store.update, set: store.set, ...actions };
}

export default exStore;
