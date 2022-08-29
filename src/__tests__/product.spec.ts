import { produce } from 'immer';
import { get } from 'svelte/store';
import exSlice from './exSlice';

test('should ', () => {
	const update = (fn: (state: any) => void, state?: any) => {
		return produce(state, fn);
	};

	const count = exSlice({
		name: 'count',
		initialValue: 0,
		increase: () => {
			update((state) => {
				state + 1;
			});
		},
		increaseBy: (amount: number) => {
			update((state) => {
				state + amount;
			});
		}
	});

	count.set(3);

	console.log(get(count));
});
