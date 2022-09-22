<script lang="ts">
	import { count } from './npm';
</script>

<h1>{$count}</h1>
<!--  $count is an alias for $count.$init  -->

<button on:click={count.increase}>+</button>
<button on:click={() => count.increaseBy(5)}>+</button>
<button on:click={count.reset}>reset</button>