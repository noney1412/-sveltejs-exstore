import { ex } from '$lib';

export interface Count {
	$init: number;
	increase(): void;
	decrease(): void;
	increaseBy(by: number): void;
	reset(): void;
}
export const count = ex<Count>({
	$name: 'count',
	$init: 0,
	increase: function () {
		this.$init += 1;
	},
	increaseBy: function (by) {
		this.$init += by;
	},
	decrease: function () {
		this.$init -= 1;
	},
	reset: function () {
		this.$init = 0;
	}
});
