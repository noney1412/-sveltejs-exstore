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
	actions: (update, set) => ({
		increase: () => update((state) => state + 1),
		increaseBy: (by) => update((state) => state + by),
		decrease: () => update((state) => state - 1),
		reset() {
			set(0);
		}
	})
});
