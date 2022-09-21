import type { ExSlice, Extensions } from './types/ExSlice';
import type { OnlyFunc, OnlyState } from './types/Utils';
interface SharedState<T> {
	name: string;
	reference: OnlyState<T>;
	mode: 'primitive' | 'reference';
	initialState: OnlyState<T> extends { $init: infer U } ? U : OnlyState<T>;
}

export function initSharedState<State>(slice: ExSlice<State>) {
	const state: SharedState<State> = {
		name: '',
		reference: {} as OnlyState<State>,
		mode: 'primitive',
		initialState: ({} as any).$init ?? undefined
	};

	state.name = slice.$name || 'anonymous_';
	state.reference = getOnlyStateFormSlice(slice);
	state.mode = analyzeMode(slice);
	state.initialState = getInitialState(state);

	return state;
}

export function getOnlyStateFormSlice<State>(
	slice: ExSlice<State>
): SharedState<State>['reference'] {
	const options: Array<keyof Extensions> = ['$name', '$options'];

	const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
		typeof value !== 'function' && !options.includes(key as keyof Extensions);

	const filtered = Object.entries(slice).filter(([key, value]) =>
		isNotFunctionAndNotOptions(key, value)
	);

	const state = Object.fromEntries(filtered) as SharedState<State>['reference'];

	return state;
}

export function analyzeMode<State>(slice: ExSlice<State>): SharedState<State>['mode'] {
	if ((slice as any).$init === undefined) return 'reference';
	return (slice as any).$init instanceof Object ? 'reference' : 'primitive';
}

export function getInitialState<State>(
	state: SharedState<State>
): SharedState<State>['initialState'] {
	const bind = state.reference as any;
	let init: any;

	if (bind.$init !== undefined) {
		init = bind.$init;
	}

	return state.mode === 'primitive' ? init : { ...state.reference };
}

export function getActions<State>(slice: ExSlice<State>) {
	const actions = Object.entries(slice).filter(([, value]) => typeof value === 'function');
	return Object.fromEntries(actions) as OnlyFunc<State>;
}
