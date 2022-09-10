import type { Writable } from 'svelte/store';
import type { Nullable } from './utils';
export type Middleware<State> = {
	storeName: string;
	initialState: State;
	previousState: Nullable<State>;
	currentState: Nullable<State>;
	currentActionName: string;
	store: Writable<State>;
};
