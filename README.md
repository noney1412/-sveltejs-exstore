[![Node.js CI](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml/badge.svg)](https://github.com/noney1412/svelte-exstore/actions/workflows/node.js.yml)

A writable store wrapper that connects to the redux devtools.

## Creating a store

### With Reference Type
```typescript
interface Count {
	value: number;
	increase: () => void;
}

const profile = exStore<Profile>({
	name: 'profile',
	initialValue: { value: 0 },
	actions: (state) => ({
		increase: () => {
			state.value += 1;
		},
	})
});

```

### With Primitive Type
```typescript
interface Count {
	$initialValue: number;
	increase: () => void;
	decrease: () => void;
	increaseBy: (by: number) => void;
	reset: () => void;
}

const count = exStore<Count>({
	name: 'count',
	initialValue: 0,
	actions: (state) => ({
		increase: () => state.current + 1,
		increaseBy: (by) => state.current + by,
		decrease: () => state.current - 1,
		reset: () => 0
	})
});

```