import exStore from '$lib';

export interface Count {
	value: number;
	increase: () => void;
	decrease: () => void;
	increaseBy: (by: number) => void;
	reset: () => void;
}
export const count = exStore<Count>({
	name: 'count',
	initialValue: {
		value: 0
	},
	actions: (update, set) => ({
		increase: () => update((state) => ({ value: state.value + 1 })),
		increaseBy: (by) => update((state) => ({ value: state.value + by })),
		decrease: () => update((state) => ({ value: state.value - 1 })),
		reset() {
			set({ value: 0 });
		}
	})
});
