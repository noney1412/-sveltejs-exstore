import exStore from './exStore.mjs';
import { get } from 'svelte/store';

function toJSON({ next }) {
	if (typeof next === 'object') {
		next = JSON.stringify(next);
	} else throw new Error('toJSON: next must be an object');

	return { next };
}

test('middleware concept', () => {
	const profile = { name: 'John Doe', age: 60 };
	const middlewares = [toJSON];

	// type of reduce must be the same as type of initial value.
	const parsed = middlewares.reduce((acc, fn) => fn(acc), { next: profile });
	console.log(parsed.next);
});

test('try implement json middleware', () => {
	const profile = exStore({ name: 'John Doe', age: 60 }, () => ({}), [toJSON]);
	expect(get(profile)).toBeInstanceOf(String);
});
