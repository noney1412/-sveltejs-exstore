[![Node.js CI](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml/badge.svg)](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml)

# Svelte ExStore 
This package basically acts as a wrapper for writable stores that connects Redux Devtools to improve workflow.

### Installation
```tsx
npm install svelte-exstore
```

```tsx
yarn add svelte-exstore
```

```tsx
pnpm add svelte-exstore
```

### Basic Example
#### 1. Create a store
`src/lib/store/count.ts`
```typescript
import { ex } from "svelte-exstore";
  
interface Count {
	$init: number;
	increase(): void;
	decrease(): void;
	increaseBy(by: number): void;
	reset(): void;
}

const count = ex<Count>({
	$name: 'count', // store name displayed in devtools, must be unique.
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
```
#### 2. Bind the store with your component.
`src/routes/+page`
```tsx
<script lang="ts">
  import { count } from '$lib/store/count';
</script>


<h1>{$count}</h1>
<!--  $count is an alias for $count.$init  -->

<button on:click={() => count.increase()}>+</button>

<button on:click={() => count.increaseBy(5)}>increase by 5</button>

<button on:click={() => count.reset()}>reset</button>
```
