import type { ExSlice, Extensions } from '../types/ExSlice';
import type { OnlyState } from '../types/Utils';

interface SharedState<T> {
	name: string;
	bind: Partial<OnlyState<T>>;
	mode: 'primitive' | 'reference';
}

export function initState<State>(slice: ExSlice<State>) {
	const state: SharedState<State> = {
		name: 'anonymous',
		bind: {},
		mode: 'primitive'
	};

	state.bind = getState(slice);
	state.mode = 'primitive';

	return state;
}

export function getState<State>(slice: ExSlice<State>): SharedState<State>['bind'] {
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
	// if $init.$init is instance of object, then it is a reference.
	// else then it is primitive.

	return slice;
}
