import type { Options } from '../types/ExSlice';

// draft: 1 exslice should support $init: {}
type ExSlice<State> = State & Partial<Options>;
export function initState<State>(slice: ExSlice<State>) {
	const options: Array<keyof Options> = ['$name', '$options'];

	const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
		typeof value !== 'function' && !options.includes(key as keyof Options);

	const filtered = Object.entries(slice).filter(([key, value]) =>
		isNotFunctionAndNotOptions(key, value)
	);

	const flatten = filtered.reduce(
		(acc, [key, value]) => {
			if (key === '$init') {
				acc.$init = value;
			} else {
				acc.$init[key] = value;
			}

			return acc;
		},
		{
			$init: {}
		}
	);

	return flatten;
}
