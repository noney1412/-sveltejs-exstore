import { writable, Writable } from 'svelte/store';

export interface CreateStore<State, ReturnState> {
	(
		update: Writable<State>['update'],
		set: Writable<State>['set'],
		subscribe: Writable<State>['subscribe']
	): ReturnState;
}

export interface Action extends Record<string, unknown> {
	name: string;
}

function exSlice<State, Action>(initialValue: State, fn: CreateStore<State, Action>) {
	const { set, subscribe, update } = writable<State>(initialValue);

	const actions = fn(update, set, subscribe);

	return {
		set,
		subscribe,
		update,
		...actions
	};
}

export default exSlice;
