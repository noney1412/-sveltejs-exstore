import type { Writable } from 'svelte/store';

/**
 * Action is to provide the name and function used within the store.
 */
export interface ExAction extends Record<string, unknown> {
	exName: string;
}

/**
 * CreateAction is a function that provide wriable store functionality and returns a store with Action.
 * it used to create a store with additional functionality by enhancers.
 */
export interface CreateExAction<State, ReturnState> {
	(
		update: Writable<State>['update'],
		set: Writable<State>['set'],
		subscribe: Writable<State>['subscribe']
	): ReturnState;
}
