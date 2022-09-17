import type { ExSlice, Extensions } from '../types/ExSlice';

export function initState<State>(slice: ExSlice<State>) {
	const state = {
		name: 'anonymous',
		bind: {},
		mode: 'primitive'
	};

	state.bind = getState(slice);

	return state;
}

export function getState<State>(slice: ExSlice<State>) {
	const options: Array<keyof Extensions> = ['$name', '$options'];

	const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
		typeof value !== 'function' && !options.includes(key as keyof Extensions);

	const filtered = Object.entries(slice).filter(([key, value]) =>
		isNotFunctionAndNotOptions(key, value)
	);

	const state = Object.fromEntries(filtered);

	return state;
}
