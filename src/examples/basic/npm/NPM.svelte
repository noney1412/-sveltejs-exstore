<script lang="ts">
	import { ex } from 'svelte-exstore';

	interface Count {
		$init: number;
		increase(): void;
		decrease(): void;
		increaseBy(by: number): void;
		reset(): void;
	}

	const count = ex<Count>({
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
</script>

<h1>{$count}</h1>
<!--  $count is an alias for $count.$init  -->

<button on:click={count.increase}>+</button>
<button on:click={() => count.increaseBy(5)}>+</button>
<button on:click={count.reset}>reset</button>
