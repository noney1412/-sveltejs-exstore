import exSlice from '$lib';
import type { Action } from '$lib/@types/Action';
import type { CreateAction } from '$lib/@types/Action';
import { get } from 'svelte/store';

interface Count extends Action {
	name: 'count';
	increase: () => void;
	increaseBy: (amount: number) => void;
}

const countAction: CreateAction<number, Count> = (update) => ({
	name: 'count',
	increase: () => {
		update((n) => n + 1);
	},
	increaseBy: function (amount): void {
		update((n) => n + amount);
	}
});

test('count with increasing the number.', () => {
	const count = exSlice<number, Count>(0, countAction);

	count.increase();

	expect(get(count)).toBe(1);

	count.increaseBy(5);

	expect(get(count)).toBe(6);
});
