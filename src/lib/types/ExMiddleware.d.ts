import type { Writable } from 'svelte/store';
import type { Nullable } from './utils';
export type ExMiddleware<State> = {
	storeName: string;
	initialState: State;
	previousState: Nullable<State>;
	currentState: Nullable<State>;
	currentActionName: string;
	store: Writable<State>;
	trace?: string;
	defaultTrace?: string;
};
