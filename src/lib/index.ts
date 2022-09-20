import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { initSharedState, bindActions, getCurrentState } from './initSharedState';
import withReduxDevtool from './middlewares/withReduxDevtools';
import type { ExMiddleware } from './types/ExMiddleware';
import type { ExSlice } from './types/ExSlice';
import type { OnlyState, OnlyFunc, Nullable } from './types/Utils';

type WritableState<T> = T | Record<string, T>;

function ex<State>(slice: ExSlice<State>) {
	const state = initSharedState(slice);

	const actions = bindActions(state.bind, slice);

	type InitialState = typeof state.initialState;

	const store = writable<WritableState<InitialState>>(state.initialState);

	const middleware = writable<ExMiddleware<WritableState<InitialState>>>({
		storeName: state.name,
		initialState: state.initialState,
		previousState: undefined as Nullable<InitialState>,
		currentState: undefined as Nullable<InitialState>,
		currentActionName: '',
		store: {
			subscribe: store.subscribe,
			set: setState,
			update: store.update
		},
		trace: '',
		defaultTrace: ''
	});

	const wrappedSet = setState;

	const wrappedUpdate = (fn: (value: InitialState) => InitialState) => {
		const value = fn(getCurrentState(state)) as WritableState<typeof state.initialState>;
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
				fn(...args);
				store.set(getCurrentState(state));
			}

			function afterUpdateSate() {
				//..
			}
		};
		return acc;
	}, {}) as OnlyFunc<State>;

	applyMiddleware();

	return {
		subscribe: store.subscribe,
		set: wrappedSet,
		update: wrappedUpdate,
		...boundActions
	} as OnlyFunc<State> &
		Writable<InitialState> & {
			set: (value: WritableState<InitialState>) => void;
			update: (fn: (value: InitialState) => InitialState) => void;
		};

	/* --- Inner functions --- */
	function setState(value: WritableState<InitialState>) {
		if (state.mode === 'primitive') {
			(state as typeof state & { bind: { $init: unknown } }).bind.$init = value;
		}

		store.set(value);
	}

	function applyMiddleware() {
		middleware.subscribe((m) => {
			withReduxDevtool<WritableState<InitialState>>(m);
		});
	}
}

export default ex;
