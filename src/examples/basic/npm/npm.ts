import { ex } from "svelte-exstore/index";

export interface Count {
	$init: number;
	increase(): void;
	decrease(): void;
	increaseBy(by: number): void;
	reset(): void;
}

export const count = ex<Count>({
	$name: 'count', // `$name` will be displayed in the devtools as a store name.
	$init: 0,
	increase: function () {
		this.$init += 1; // retrieve your current state with `this` keyword.
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