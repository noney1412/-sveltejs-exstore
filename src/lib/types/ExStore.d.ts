import type { Writable } from 'svelte/store';
import type { ExSlice } from './ExSlice';
import type { OnlyFunc, OnlyPrimitive } from './utils';

/** 
 * ReturnType of the {@link CreateExStore<State>}
 * @typeParam State - initial value.
*/
type ReturnExStore<State> = Writable<OnlyPrimitive<State>> & OnlyFunc<State>;

/**
 * Create a single store.
 * @typeParam State - type of the initial state.
 * @param {ExSlice<State>} slice is the parameter object to init exStore.
 */
export type CreateExStore<State> = (slice: ExSlice<State>) => ReturnExStore<State>;
