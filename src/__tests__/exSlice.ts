import { writable, Writable } from 'svelte/store';

export interface ExAction<TState, TReturnState> {
	(
		update: Writable<TState>['update'],
		set: Writable<TState>['set'],
		subscribe: Writable<TState>['subscribe']
	): TReturnState;
}

export interface ExSlice {
	name: string;
}

function exSlice<TState, TAction extends ExSlice>(
	initialValue: TState,
	fn: ExAction<TState, TAction>
) {
	const { set, subscribe, update } = writable<TState>(initialValue);

	const result = fn(update, set, subscribe);

	return {
		set,
		subscribe,
		update,
		...result
	};
}

export default exSlice;
