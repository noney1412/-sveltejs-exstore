import exSlice from './exSlice';
import type { ExSlice } from './exSlice';
import { get } from 'svelte/store';

interface Count extends ExSlice {
	increase: () => void;
	increaseBy: (value: number) => void;
}

test('should use as zustand', () => {
	const count = exSlice<number, Count>(0, (update) => ({
		name: 'count',
		increase: () => update((count) => count + 1),
		increaseBy: (value: number) => update((count) => count + value)
	}));

	count.increase();

	expect(get(count)).toBe(1);

	console.log(get(count));
});
