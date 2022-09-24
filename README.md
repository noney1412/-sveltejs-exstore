[![Node.js CI](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml/badge.svg)](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml)

# Svelte ExStore 
This package basically acts as a wrapper for writable stores.

### Features
1. connects Redux Devtools to monitor your state. multiple stores in the same `+page` is also supported.
2. an action uses `this` keyword to manage your state.
3. supports `primitive value`, if you assign primitive value using `$init`  eg. `$init: 0`, then `get(store)` return `0`

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

## Basic Example
### 1. Create a store
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

export const count = ex<Count>({
  $name: 'count', // store name displayed in devtools, must be unique.
  $init: 0,
  increase() {
    this.$init += 1; // retrieve your current state with `this` keyword.
  },
  increaseBy(by) {
    this.$init += by;
  },
  decrease() {
    this.$init -= 1;
  },
  reset() {
    this.$init = 0;
  }
});
```
### 2. Bind the store to your component.
`src/routes/+page.svelte`
```svelte
<script lang="ts">
  import { count } from '$lib/store/count';
</script>


<h1>{$count}</h1>
<!--  $count is an alias for count.$init  -->

<button on:click={() => count.increase()}>+</button>

<button on:click={() => count.increaseBy(5)}>increase by 5</button>

<button on:click={() => count.reset()}>reset</button>
```
### 3. Monitor your state with Redux Devtools.

<p align="center">
  <img src="/docs/screenshots/Screenshot_2.png"  title="hover text">
</p>

<p align="center">
  <img src="/docs/screenshots/Screenshot_3.png"  title="hover text">
</p>

## State Management
### Primitive Value
#### with `$init` -- `get(store)` will return `$init`
`count.ts`
```typescript
  interface Count {
    $init: number;
    increase: () => void;
  }

  const count = ex<Count>({
    $name: 'count-test-store',
    $init: 0,
    increase() {
      this.$init += 1;
    }
  });
```
`Count.svelte`
```svelte
<h1>{$count}</h1>
<!--  $count is an alias for count.$init  -->
```
