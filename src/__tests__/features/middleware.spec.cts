import exStore from './exStore.mjs';
import { get } from 'svelte/store';

function toJSON({ next }) {
	if (typeof next === 'object') {
		next = JSON.stringify(next);
	} else throw new Error('toJSON: next must be an object');

	return { next };
}

function withHello({ next }) {
	return { next: next };
}

function preCondition(condition) {
	switch (condition) {
		case undefined:
			throw new Error('preCondition Middleware: condition is undefined');
		case false:
			throw new Error('preCondition Middleware: condition must be true');
		default:
			throw new Error('preCondition Middleware: condition must be true or false' + condition);
		case true:
			return (next) => next;
	}
}

function postCondition({ next }) {
	return next;
}

test('middleware concept', () => {
	const profile = { name: 'John Doe', age: 60 };
	const middlewares = [preCondition(true), toJSON, withHello, postCondition];
	const parsed = middlewares.reduce((acc, fn) => fn(acc), { next: profile });
	console.log(parsed.next);
});

test('try implement json middleware', () => {
	const profile = exStore({ name: 'John Doe', age: 60 }, () => ({}), [toJSON]);
	expect(typeof get(profile)).toEqual('string');
	console.log(profile.raw);
});
