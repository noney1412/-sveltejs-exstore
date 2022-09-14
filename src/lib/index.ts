import { get, writable } from 'svelte/store';
import withReduxDevtool from './middlewares/withReduxDevtools';
import type { Middleware } from './types/ExMiddleware';
import type { ExSlice, ExState, InitialValue } from './types/ExSlice';
import type { Nullable, OnlyFunc } from './types/utils';

function exStore<State>(slice: ExSlice<State>) {
	const store = writable<InitialValue<State>>(slice.initialValue as InitialValue<State>);

	let state: ExState<State> = {} as ExState<State>;
	type WrappedAction = OnlyFunc<State> & {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: any;
	};

	const actions = slice.actions?.(defineState()) as WrappedAction;

	const middleware = writable<Middleware<InitialValue<State>>>({
		storeName: slice.name,
		initialState: slice.initialValue as InitialValue<State>,
		previousState: undefined as Nullable<InitialValue<State>>,
		currentState: undefined as Nullable<InitialValue<State>>,
		currentActionName: '',
		store: {
			subscribe: store.subscribe,
			set: (x: InitialValue<State> | Record<string, never>) => {
				if (x instanceof Object) {
					store.set(x as InitialValue<State>);
				} else {
					state.current = x;
					store.set(state.current);
				}
			},
			update: store.update
		}
	});

	const wrapMiddlewareStore = {
		set: (x: InitialValue<State> | Record<string, never>) => {
			const m = get(middleware);
			m.currentActionName = 'set';
			m.previousState = get(store) as Nullable<InitialValue<State>>;
			if (x instanceof Object) {
				store.set(x as InitialValue<State>);
			} else {
				state.current = x;
				store.set(state.current);
			}
			m.currentState = get(store) as Nullable<InitialValue<State>>;
			middleware.set(m);
		},
		update: (fn: (x: InitialValue<State>) => InitialValue<State>) => {
			const m = get(middleware);
			m.currentActionName = 'update';
			m.previousState = get(store) as Nullable<InitialValue<State>>;
			store.update(fn);
			m.currentState = get(store) as Nullable<InitialValue<State>>;
			middleware.set(m);
		}
	};

	wrapAction();
	applyMiddleware();

	return {
		subscribe: store.subscribe,
		update: wrapMiddlewareStore.update,
		set: wrapMiddlewareStore.set,
		...actions
	};

	/**
	 * Define state if the initial value is primitive or reference type
	 * - Primitive type: number, string, boolean, null, undefined
	 * - Reference type: object, array, function
	 * if the initial value is a primitive type, the state will be `{ current: initialValue }`
	 * if the initial value is a reference type, the state will be `initialValue`
	 */
	function defineState() {
		if (slice.initialValue instanceof Object) {
			state = slice.initialValue as ExState<State>;
		} else {
			state = {
				current: slice.initialValue
			} as ExState<State>;
		}

		return state;
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
				actions[key as keyof WrappedAction] = function (...args: unknown[]) {
					const m = get(middleware);

					beforeUpdateState();
					updateState();
					afterUpdateState();

					function beforeUpdateState() {
						m.previousState = get(store) as Nullable<InitialValue<State>>;
					}

					function updateState() {
						store.update((current) => {
							if (current instanceof Object) {
								fn(...args);
								// the current is here (reference type)
								return state as InitialValue<State>;
							} else {
								state.current = fn(...args) as InitialValue<State>;
								// the current is here (primitive type)
								return state.current;
							}
						});
					}

					function afterUpdateState() {
						m.currentActionName = key;
						m.currentState = get(store) as Nullable<InitialValue<State>>;
						middleware.set(m);
					}
				};
			}
		}
	}

	/**
	 * subscribe the middlewaretore to apply middlewares.
	 */
	function applyMiddleware() {
		middleware.subscribe((m) => {
			withReduxDevtool<InitialValue<State>>(m);
		});
	}
}

export default exStore;
