import { writable } from 'svelte/store';

function applyMiddlewares(middlewares, next) {
	return middlewares.reduce((next, middleware) => middleware(next), next);
}

function exStore(initialValue, middlewares) {
	let parsed;

	if (middlewares) {
		parsed = applyMiddlewares(middlewares, { next: initialValue }).next;
	}
	// must be applied the initial value with middlewares
	const { set, subscribe, update } = writable(parsed);

	return { set, subscribe, update };
}

export default exStore;
