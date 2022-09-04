import type { Writable } from 'svelte/store';
import type { ExSlice } from './ExSlice';
import type { OnlyFunc } from './utils';

/**
 * ExStore is redux-like store.
 * @typeParam State - initial value.
 */
export type ExStore<State> = Writable<ExSlice<State>['initialValue']> & OnlyFunc<State>;

/**
 * Create a single store.
 * @typeParam State - type of the initial state.
 * @param {ExSlice<State>} slice is the parameter object to init exStore.
 */
export type CreateExStore = <State>(slice: ExSlice<State>) => ExStore<State>;
