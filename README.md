# Svelte ExStore

This package is basically a writable store wrapper.

connect Redux Devtools to enhance your work flow.

## Usage

```tsx
npm install svelte-exstore
```
```tsx
yarn add svelte-exstore
```
```tsx
pnpm add svelte-exstore
```

### 1. Create a store

```tsx
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
```

### 2. Then bind it to your svelte component

```tsx
<script lang="ts">
	import { count } from './count';
</script>

<h1>{$count}</h1>
<!--  $count is an alias for $count.$init  -->

<button on:click={count.increase}>+</button>
<button on:click={() => count.increaseBy(5)}>+</button>
<button on:click={count.reset}>reset</button>
```

### 3. Finally, manage your state with the redux devtools

<p align="center">
  <img src="/docs/screenshots/Screenshot_2.png"  title="hover text">
</p>

<p align="center">
  <img src="/docs/screenshots/Screenshot_3.png"  title="hover text">
</p>

## More examples

### Multiple Store Supports

### 1. Add one more store

```tsx
export interface Profile {
	name?: string;
	age?: number;
	changeName: (name: string) => void;
}

export const profile = ex<Profile>({
	$name: 'profile',
	name: undefined,
	age: undefined,
	changeName(name: string) {
		this.name = name;
	}
});
```

### 2. Then bind it to your svelte component

```tsx
<script lang="ts">
	import { count } from './count';
	import { profile } from './profile';
</script>

<h1>{$profile.name ?? ''}</h1>
<h2>{$profile.age ?? ''}</h2>

<!-- bind input value to the profile store -->
<input type="text" placeholder="name" bind:value={$profile.name} />
<input type="text" placeholder="age" bind:value={$profile.age} />

<!-- change your state by an action -->
<button on:click={() => { profile.changeName('John Doe');}}>
		Change Name To John Doe
</button>

<!-- set your current state by store.set() from writable store -->
<button on:click={() => { profile.set({});}}>
		Reset Name
</button>
```

- you can also use `profile.subscribe()` `profile.update()` too.

### 3. Finally, both of them are displayed.

<p align="center">
  <img src="/docs/screenshots/Screenshot_5.png"  title="hover text">
</p>

## For Vitest

### Add this to your `setupTests.ts`

```tsx
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