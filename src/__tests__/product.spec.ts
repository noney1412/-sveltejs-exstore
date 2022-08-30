import exSlice, { ExAction } from './exSlice';
import type { ExSlice } from './exSlice';
import { get } from 'svelte/store';

interface Count extends ExSlice {
	increase: () => void;
	increaseBy: (value: number) => void;
}

test('should use as zustand', () => {
	const countUpdated: ExAction<number, Count> = (update) => {
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
