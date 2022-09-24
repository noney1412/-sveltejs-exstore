[![Node.js CI](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml/badge.svg)](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml)


# Svelte ExStore 
This package basically acts as a wrapper for writable stores.

### Features
1. Connects Redux Devtools to monitor your state. multiple stores in the same `+page` is also supported.
2. An action uses `this` keyword to manage your state.
3. Supports [primitive value](#primitive-value), if you assign primitive value using `$init`  eg. `$init: 0`, then `get(store)` return `0`.
4. When the state is reference type by default, you can simply access it by `this` keyword. read [reference type](#reference-value), for more details...

### Contents
1. [Installation](#installation)
2. [Basic Example](#basic-example)
3. [State Management](#state-management)
4. [For Vitest support](#for-vitest-support)

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
#### if the state is `primitive type`, the action can also return the value like this.
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
    return this.$init + 1; // support only primitive type.
  }
});
```
### Reference Value
#### When the state is reference type by default, you can simply access it by `this` keyword.
`profile.ts`
```ts
interface Profile {
  name: string;
  age: number;
  description?: string;
  increaseAgeBy: (value:number) => void;
}

const profile = ex<Profile>({
  $name: 'profile-test-store',
  name: '',
  age: 20,
  increaseAgeBy(value){
    this.age += value;
  }
})
```
`Profile.svelte`
```svelte
<h1>{$profile.name}</h1>
<h2>{$profile.age}</h2>
<h2>{$profile.description ?? ''}</h2>
```
### the default function `store.subscribe()`, `store.set()` and `store.update()` are also available.
```ts
profile.update((state) => {
  state = { name: 'Jack', age: 30 };
  return state;
});

profile.set({});
```
`Profile.svelte`
```svelte
<button on:click={() => { profile.set({}); }}> Reset Name </button>
```
#### the `store.subscribe()` now provide readonly state by default to prevent unpredictable state change.
```typescript
profile.subscribe((value) => {
  console.log('stage 9: readonly reference', value);

  // if uncomment this, it should throw an error. because the state is readonly.
  // value.name = 'Jane';
});
```


## For Vitest support
#### add this to `setupTests.ts`
```ts
vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');
	/**
	 * @type {import('$app/stores').getStores}
	 */
	const getStores = () => ({
		navigating: readable(null),
		page: readable({ url: new URL('http://localhost'), params: {} }),
		session: writable(null),
		updated: readable(false)
	});
	/** @type {typeof import('$app/stores').page} */
	const page = {
		subscribe(fn: () => void) {
			return getStores().page.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').navigating} */
	const navigating = {
		subscribe(fn: () => void) {
			return getStores().navigating.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').session} */
	const session = {
		subscribe(fn: () => void) {
			return getStores().session.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').updated} */
	const updated = {
		subscribe(fn: () => void) {
			return getStores().updated.subscribe(fn);
		}
	};
	return {
		getStores,
		navigating,
		page,
		session,
		updated
	};
});

vi.mock('$app/environment', async () => {
	/** @type {typeof import('$app/environment').browser} */
	const browser = true;
	/** @type {typeof import('$app/environment').dev} */
	const dev = true;
	/** @type {typeof import('$app/environment').prerendering} */
	const prerendering = false;

	return {
		browser,
		dev,
		prerendering
	};
});
```
