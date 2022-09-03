import type { Writable } from 'svelte/store';
import type { ExSlice } from './ExSlice';
import type { OnlyFunc, OnlyPrimitive } from './utils';

type ReturnExStore<State> = Writable<OnlyPrimitive<State>> & OnlyFunc<State>;

/**
 * Create an exStore.
 * @type {State} type of the initial state.
 * @param {ExSlice<State>} slice is the parameter object for exStore.
 */
export type CreateExStore<State> = (slice: ExSlice<State>) => ReturnExStore<State>;
