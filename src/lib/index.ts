import { writable } from 'svelte/store';
import type { ExSlice, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	const actions = slice.actions?.(initialValue) as WrappedActions;

	for (const [key, value] of Object.entries(actions)) {
		const fn = value as any;
		actions[key as keyof WrappedActions] = function (...args: unknown[]) {
			console.log(`${slice.name}/${key}`, args);
			update((state) => {
				fn(...args);
				return state;
			});
		};
	}

	return { subscribe, update, set, ...actions };
}

export default exStore;
