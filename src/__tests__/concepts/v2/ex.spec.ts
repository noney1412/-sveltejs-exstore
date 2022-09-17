import { get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd';
import { ex } from './ex';

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
