import type { ExSlice, Extensions } from './types/ExSlice';
import type { OnlyFunc, OnlyState } from './types/Utils';

export type Mode = 'bind-$init' | 'as-reference';

export function analyzeMode<State>(state: OnlyState<State>): Mode {
	if ((state as any).$init === undefined && !Object.hasOwn(state, '$init')) return 'as-reference';
	return (state as any).$init instanceof Object ? 'as-reference' : 'bind-$init';
}

export function getOnlyStateFormSlice<State>(slice: ExSlice<State>): OnlyState<State> {
	const options: Array<keyof Extensions> = ['$name', '$options'];

	const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
		typeof value !== 'function' && !options.includes(key as keyof Extensions);

	const filtered = Object.entries(slice).filter(([key, value]) =>
		isNotFunctionAndNotOptions(key, value)
	);

	const state = Object.fromEntries(filtered) as OnlyState<State>;

	return state;
}

export function getInitialState<State>(
	state: OnlyState<State>,
	mode: Mode
): OnlyState<State> extends { $init: infer U } ? U : OnlyState<State> {
	return mode === 'bind-$init' ? (state as any).$init : { ...state };
}

export function getActionsFromSlice<State>(slice: ExSlice<State>) {
	const actions = Object.entries(slice).filter(([, value]) => typeof value === 'function');
	return Object.fromEntries(actions) as OnlyFunc<State>;
}
