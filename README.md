# Documentation

Date Created: September 21, 2022 11:24 PM
Last edited by: cn p
Last edited time: September 22, 2022 12:09 AM

# Svelte ExStore

This package is basically a writable store wrapper.

connect Redux Devtools to enhance your work flow.

## Usage

```tsx
npm install svelte-exstore
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

### 2. Then bind your svelte component

```tsx
<script lang="ts">
	import { count } from './count';
</script>

<h1>{$count}</h1>
<button on:click={count.increase}>+</button>
<button on:click={() => count.increaseBy(5)}>+</button>
<button on:click={count.reset}>reset</button>
```

### 3. Finally, manage your state with the redux devtools

<p align="center">
  <img src="/docs/screenshots/Screenshot_2.png" width="350" title="hover text">
</p>

<p align="center">
  <img src="/docs/screenshots/Screenshot_3.png" width="350" title="hover text">
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

### 2. Then bind your svelte component

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
  <img src="/docs/screenshots/Screenshot_5.png" width="350" title="hover text">
</p>