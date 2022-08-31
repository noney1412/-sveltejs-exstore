import { writable } from 'svelte/store';

function exStore(initialValue, fn, middlewares) {

	if(middlewares) { 
		const initialValue = middlewares.reduce((initialValue, middleware) => middleware(initialValue), initialValue);
	}
	// must be applied the initial value with middlewares
	const { set, subscribe, update } = writable(initialValue);

	console.log(typeof middlewares[0](initialValue));

	return fn;
}

export default exStore;
