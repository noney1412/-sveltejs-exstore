import { writable } from 'svelte/store';
import type { ExSlice, ExState, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const { initialValue } = slice;

	const store = writable<InitialValue<State>>(initialValue);

	let state: ExState<State> = {} as ExState<State>;

	if (initialValue instanceof Object) {
		state = initialValue as ExState<State>;
	} else {
		state = {
			current: initialValue
		} as ExState<State>;
	}

	type WrappedActions = OnlyFunc<State> & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};

	const actions = slice.actions?.(state) as WrappedActions;

	if (actions && actions instanceof Object) {
		for (const key in actions) {
			const fn = actions[key] as (...args: unknown[]) => void | InitialValue<State>;
			actions[key as keyof WrappedActions] = function (...args: unknown[]) {
				store.update((current) => {
					if (current instanceof Object) {
						fn(...args);
						return current;
					} else {
						state.current = fn(...args) as InitialValue<State>;
						return state.current ?? current;
					}
				});
			};
		}
	}

	return { subscribe: store.subscribe, update: store.update, set: store.set, ...actions };
}

export default exStore;
