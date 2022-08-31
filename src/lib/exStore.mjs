import { writable } from 'svelte/store';

function exStore(initialValue, fn) {
	const { set, subscribe, update } = writable(initialValue);

	const actions = fn(update, set, subscribe);

	const store = {
		set,
		subscribe,
		update,
		...actions
	};

	return store;
}

export default exStore;
