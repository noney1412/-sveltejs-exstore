<script lang="ts">
	import { count } from './count';
</script>

<div
	class="column-container"
	w="450px"
	h="450px"
	flex="~ col"
	justify="center"
	align="items-center"
	gap="18px"
>
	<h1>{$count}</h1>
	<div flex="~" w="full" h="60px" justify="center">
		<button on:click={count.decrease} w="60px" h="full" bg="dark-50">-</button>
		<input
			bind:value={$count}
			class="form__input"
			flex="~"
			type="number"
			w="80px"
			h="full"
			text="light-50"
		/>
		<button on:click={count.increase} w="60px" h="full" bg="dark-50 hover:dark-500">+</button>
	</div>
	<button
		on:click={() => count.increaseBy(5)}
		w="180px"
		h="60px"
		bg="dark-300 hover:dark-500"
		font="hover:bold">increase by 5</button
	>
	<button on:click={count.reset}>reset</button>
</div>

<style lang="scss">
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
		text-align: center;
	}
</style>
