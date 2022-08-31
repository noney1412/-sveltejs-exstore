import { writable } from 'svelte/store';
import type { CreateExAction } from './types/ExAction';

function exStore<State, Action>(initialValue: State, fn: CreateExAction<State, Action>) {
	const { set, subscribe, update } = writable<State>(initialValue);

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
