import exSlice, { CreateStore } from './exSlice';
import type { Action } from './exSlice';
import { get } from 'svelte/store';

interface Count extends Action {
	name: 'count';
	increase: () => void;
	increaseBy: (value: number) => void;
}

test('should use as zustand', () => {
	const countUpdated: CreateStore<number, Count> = (update) => {
		return {
			name: 'count',
			increase: () => update((n) => n + 1),
			increaseBy: (value: number) => update((n) => n + value)
		};
	};

	const count = exSlice<number, Count>(0, countUpdated);

	count.increase();

	expect(get(count)).toBe(1);

	console.log(get(count));
});
