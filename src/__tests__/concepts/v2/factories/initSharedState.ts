import type { ExSlice, Extensions } from '../types/ExSlice';
import type { OnlyFunc, OnlyState } from '../types/Utils';
import uuid from 'uuid-random';
interface SharedState<T> {
	name: string;
	bind: OnlyState<T>;
	mode: 'primitive' | 'reference';
	initialState: OnlyState<T> extends { $init: infer U } ? U : OnlyState<T>;
}

export function initSharedState<State>(slice: ExSlice<State>) {
	const state: SharedState<State> = {
		name: '',
		bind: {} as OnlyState<State>,
		mode: 'primitive',
		initialState: ({} as any).$init ?? undefined
	};

	state.name = slice.$name || 'anonymous_' + uuid();
	state.bind = getOnlyStateFormSlice(slice);
	state.mode = analyzeMode(slice);
	state.initialState = getCurrentState(state);

	return state;
}

export function getOnlyStateFormSlice<State>(slice: ExSlice<State>): SharedState<State>['bind'] {
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
	if ((slice as any).$init === undefined) return 'reference';
	return (slice as any).$init instanceof Object ? 'reference' : 'primitive';
}

export function getCurrentState<State>(
	state: SharedState<State>
): SharedState<State>['initialState'] {
	const bind = state.bind as any;
	let init: any;

	if (bind.$init !== undefined) {
		init = bind.$init;
	}

	return state.mode === 'primitive' ? init : state.bind;
}

export function bindActions<State>(bind: SharedState<State>['bind'], slice: ExSlice<State>) {
	const actions = Object.entries(slice).filter(([, value]) => typeof value === 'function');

	//Fix type later.
	// eslint-disable-next-line @typescript-eslint/ban-types
	const bound = actions.map(([key, value]) => [key, (value as unknown as Function).bind(bind)]);

	return Object.fromEntries(bound) as OnlyFunc<State>;
}
