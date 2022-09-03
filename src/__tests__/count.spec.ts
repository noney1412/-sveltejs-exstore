import exStore from '$lib';
import type { ExAction } from '$lib/types/ExAction';
import type { CreateExAction } from '$lib/types/ExAction';
import { get } from 'svelte/store';

interface Count extends ExAction {
	exName: 'count';
	increase: () => void;
	increaseBy: (amount: number) => void;
}

const countAction: CreateExAction<number, Count> = (update) => ({
	exName: 'count',
	increase: () => {
		update((n) => n + 1);
	},
	increaseBy: function (amount): void {
		update((n) => n + amount);
	}
});

test('count with increasing the number.', () => {
	const count = exStore<number, Count>(0, countAction);
	count.increase();
	expect(get(count)).toBe(1);
	count.increaseBy(5);
	expect(get(count)).toBe(6);
});
