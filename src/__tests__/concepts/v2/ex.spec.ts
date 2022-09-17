import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { ExSlice, Options } from './types/ExSlice';
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd';
import type { OnlyState } from './types/Utils';

function ex<State>(slice: ExSlice<State>) {
	// extract state from slice.
	const $state = initState(slice);

	console.log($state);

	const $options: Options = {
		$name: '',
		$options: {}
	};

	const store = writable(($state as any).$init);

	return store;

	// FIXME: 1. exslice should support $init: {}
	function initState(slice: ExSlice<State>) {
		const options: Array<keyof Options> = ['$name', '$options'];

		const isNotFunctionAndNotOptions = (key: string, value: unknown) =>
			typeof value !== 'function' && !options.includes(key as keyof Options);

		const filtered = Object.entries(slice).filter(([key, value]) =>
			isNotFunctionAndNotOptions(key, value)
		);

		const $state = Object.fromEntries(filtered) as OnlyState<State>;

		return $state;
	}
}

interface Count {
	$init: number;
	increase: () => void;
	increaseBy: (by: number) => void;
	decrease: () => void;
	reset: () => void;
}

const count = ex<Count>({
	$name: 'count-store',
	$init: 0,
	increase() {
		this.$init + 1;
	},
	increaseBy(by) {
		this.$init + by;
	},
	decrease() {
		this.$init - 1;
	},
	reset() {
		this.$init = 0;
	}
});

test('count should be a writable store', () => {
	expectType<Writable<unknown>>(count);
});

describe(`stage:1 (count) function: Subscribe, Update and Set`, () => {
	let unsubscribe: () => void;

	beforeAll(() => {
		unsubscribe = count.subscribe((value) => {
			expectType<number>(value as number);
			console.log('count: ', value);
		});
	});

	beforeEach(() => {
		count.set(0);
		expect(get(count)).toBe(0);
	});

	afterAll(() => {
		unsubscribe();
		count.set(0);
		expect(get(count)).toBe(0);
	});

	it('increase', () => {
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);
	});

	it('increaseBy', () => {
		count.update((c) => c + 2);
		expect(get(count)).toBe(2);
	});

	it('decrease', () => {
		count.update((c) => c - 1);
		expect(get(count)).toBe(-1);
	});

	it('reset', () => {
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);

		count.update(() => 0);
		expect(get(count)).toBe(0);
	});
});
