import { writable } from 'svelte/store';
import type { ExSlice, ExState, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const { initialValue } = slice;

	const store = writable<InitialValue<State>>(initialValue);
	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	let state: ExState<State>;

	if (initialValue instanceof Object) {
		state = initialValue as ExState<State>;
	} else {
		state = {
			current: initialValue
		} as ExState<State>;
	}

	const actions = slice.actions?.(state, store.update) as WrappedActions;

	if (actions && actions instanceof Object) {
		for (const key in actions) {
			const fn = actions[key] as any;
			actions[key as keyof WrappedActions] = function (...args: unknown[]) {
				store.update((state) => {
					const result = fn(...args);
					console.log('what is the result from actions?', result);
					return result ?? state;
				});
			};
		}
	}

	return { subscribe: store.subscribe, update: store.update, set: store.set, ...actions };
}

export default exStore;
