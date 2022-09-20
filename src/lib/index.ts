import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { initSharedState, bindActions, getCurrentState } from './initSharedState';
import withReduxDevtool from './middlewares/withReduxDevtools';
import type { ExMiddleware } from './types/ExMiddleware';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc, Nullable } from './types/Utils';

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
		defaultTrace: new Error().stack
	});

	const wrappedSet = (value: WritableState<InitialState>) => {
		const m = get(middleware);
		m.currentActionName = 'set';
		m.previousState = get(store) as Nullable<InitialState>;
		setState(value);
		m.currentState = get(store) as Nullable<InitialState>;
		m.trace = getOnlySvelteTrace();
		middleware.set(m);
	};

	const wrappedUpdate = (fn: (value: InitialState) => InitialState) => {
		const m = get(middleware);
		m.currentActionName = 'update';
		m.previousState = get(store) as Nullable<InitialState>;
		const value = fn(getCurrentState(state));
		wrappedSet(value);
		m.currentState = get(store) as Nullable<InitialState>;
		m.trace = getOnlySvelteTrace();
		middleware.set(m);
	};

	const boundActions = Object.keys(actions).reduce((acc, key) => {
		const fn = actions[key];
		acc[key] = function (...args: unknown[]) {
			const m = get(middleware);
			beforeUpdateSate();
			updateState();
			afterUpdateSate();

			function beforeUpdateSate() {
				m.previousState = get(store) as Nullable<InitialState>;
				m.currentActionName = key;
			}

			function updateState() {
				fn(...args);
				store.set(getCurrentState(state));
			}

			function afterUpdateSate() {
				m.currentState = get(store) as Nullable<InitialState>;
				m.trace = getOnlySvelteTrace();
				middleware.set(m);
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
			if (slice.$name) withReduxDevtool<WritableState<InitialState>>(m);
		});
	}

	function getOnlySvelteTrace() {
		const stack = new Error().stack?.split('\n');
		const svelte = stack?.filter((x) => x.includes('.svelte')) ?? [];
		const store = [get(middleware).defaultTrace?.split('\n').at(-1)] ?? [];
		const trace = [stack?.at(0), ...svelte, ...store].join('\n');
		return trace;
	}
}

export default ex;
