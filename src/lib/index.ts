import { writable } from 'svelte/store';
import type { CreateAction } from './types/Action';

function exStore<State, Action>(initialValue: State, fn: CreateAction<State, Action>) {
	const { set, subscribe, update } = writable<State>(initialValue);

	const actions = fn(update, set, subscribe);

	const store = { set, subscribe, update, ...actions };

	return store;
}

export default exStore;
