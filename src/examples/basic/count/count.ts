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
	actions: (state) => ({
		increase: () => state.current + 1,
		increaseBy: (by) => state.current + by,
		decrease: () => state.current - 1,
		reset: () => 0
	})
});
