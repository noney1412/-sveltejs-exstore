import type { ExSlice, Extensions } from '../types/ExSlice';
import type { OnlyState } from '../types/Utils';
import uuid from 'uuid-random';
interface SharedState<T> {
	name: string;
	bind: Partial<OnlyState<T>>;
	mode: 'primitive' | 'reference';
	initialState: Partial<OnlyState<T>> extends { $init: infer U } ? U : Partial<OnlyState<T>>;
}

export function initSharedState<State>(slice: ExSlice<State>) {
	const state: SharedState<State> = {
		name: 'anonymous',
		bind: {},
		mode: 'primitive', // default is primitive
		initialState: slice.$init
	};

	state.name = slice.$name || 'anonymous_' + uuid();
	state.bind = bindState(slice);
	state.mode = analyzeMode(slice);
	state.initialState = getInitialState<State>(state);

	return state;
}

export function bindState<State>(slice: ExSlice<State>): SharedState<State>['bind'] {
	const options: Array<keyof Extensions> = ['$name', '$options'];

	const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
		typeof value !== 'function' && !options.includes(key as keyof Extensions);

	const filtered = Object.entries(slice).filter(([key, value]) =>
		isNotFunctionAndNotOptions(key, value)
	);

	const state = Object.fromEntries(filtered) as SharedState<State>['bind'];

	return state;
}

export function analyzeMode<State>(slice: ExSlice<State>): SharedState<State>['mode'] {
	if (slice.$init === undefined) return 'reference';
	return slice.$init instanceof Object ? 'reference' : 'primitive';
}

export function getInitialState<State>(state: SharedState<State>) {
	const bind = state.bind as any;
	let init: any;

	if (bind.$init !== undefined) {
		init = bind.$init;
	}

	return state.mode === 'primitive' ? init : state.bind;
}
