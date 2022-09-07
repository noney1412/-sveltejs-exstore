import exStore from '$lib';

export interface Count {
	$initialValue: number;
	increase: () => void;
	decrease: () => void;
	increaseBy: (by: number) => void;
	reset: () => void;
}
export const count = exStore<Count>({
	name: 'count',
	initialValue: 0,
	actions: (state, update) => ({
		increase: () => {
			update((state) => state + 1);
		},
		increaseBy: (by) => state + by,
		decrease: () => state - 1,
		reset() {
			0;
		}
	})
});
