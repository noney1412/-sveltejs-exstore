import { writable } from 'svelte/store';
import type { ExSlice, ExState, InitialValue } from './types/ExSlice';
import type { OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const { initialValue } = slice;

	const store = writable<InitialValue<State>>(initialValue);

	let state: ExState<State> = {} as ExState<State>;

	defineState();

	type WrappedActions = OnlyFunc<State> & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};

	const actions = slice.actions?.(state) as WrappedActions;

	wrapAction();

	return { subscribe: store.subscribe, update: store.update, set: store.set, ...actions };

	/**
	 * Define state if the initial value is primitive or reference type
	 * - Primitive type: number, string, boolean, null, undefined
	 * - Reference type: object, array, function
	 * if the initial value is a primitive type, the state will be `{ current: initialValue }`
	 * if the initial value is a reference type, the state will be `initialValue`
	 */
	function defineState() {
		if (initialValue instanceof Object) {
			state = initialValue as ExState<State>;
		} else {
			state = {
				current: initialValue
			} as ExState<State>;
		}
	}

	/**
	 * Wrap all action functions in order to custom update behavior.
	 * (only primitive type) If the action function returns a value, the store will be updated with the returned value.
	 * (only primitive type) state.current will be updated with the returned value.
	 * (reference type) no value returned. state will be updated within the actions.
	 */
	function wrapAction() {
		if (actions && actions instanceof Object) {
			for (const key in actions) {
				const fn = actions[key] as (...args: unknown[]) => void | InitialValue<State>;
				actions[key as keyof WrappedActions] = function (...args: unknown[]) {
					// actions is called here
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
	}
}

export default exStore;
