import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import {
	getActionsFromSlice,
	analyzeMode,
	getInitialState,
	getOnlyStateFormSlice
} from './storeCreators';
import withReduxDevtool from './middlewares/withReduxDevtools';
import type { ExMiddleware } from './types/ExMiddleware';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc, Nullable } from './types/Utils';

type WritableState<T> = T | Record<string, T>;

export function ex<State>(slice: ExSlice<State>) {
	const state = getOnlyStateFormSlice(slice);
	const mode = analyzeMode(state);
	const initialState = getInitialState(state, mode);
	const actions = getActionsFromSlice(slice);

	type InitialState = typeof initialState;

	const store = writable<WritableState<InitialState>>(initialState);

	const middleware = writable<ExMiddleware<WritableState<InitialState>>>({
		storeName: slice.$name ?? '',
		initialState: initialState,
		previousState: undefined as Nullable<InitialState>,
		currentState: undefined as Nullable<InitialState>,
		currentActionName: '',
		store: {
			subscribe: store.subscribe,
			set: store.set,
			update: store.update
		},
		trace: '',
		defaultTrace: new Error().stack
	});

	const wrappedSet = (value: WritableState<InitialState>) => {
		const m = get(middleware);
		m.currentActionName = 'set';
		m.previousState = get(store) as Nullable<InitialState>;
		store.set(value);
		m.currentState = get(store) as Nullable<InitialState>;
		m.trace = getOnlySvelteTrace();
		middleware.set(m);
	};

	const wrappedUpdate = (
		fn: (value: WritableState<InitialState>) => WritableState<InitialState>
	) => {
		const m = get(middleware);
		m.currentActionName = 'update';
		m.previousState = get(store) as Nullable<InitialState>;
		store.update(fn);
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
				store.update((prev) => {
					if (mode === 'bind-$init') {
						const bindState = {
							$init: prev
						};
						fn.apply(bindState, args); // if primitive mode, cache the state in $init.
						return bindState.$init;
					} else {
						fn.apply(prev, args);
						return prev;
					}
				});
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
	function applyMiddleware() {
		// REMARK: Infer user to use devtool by providing $name.
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
