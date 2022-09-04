import type { Writable } from 'svelte/store';
import type { OnlyFunc, OnlyPrimitive } from './utils';
/**
 * ExSlice is the object to init ExStore.
 * @typeParam State - initial value.
 */
export type ExSlice<State> = {
	/**
	 * The name of the store, which is used in devtools.
	 */
	name: string;
	/**
	 * The initial value of State.
	 * - extract only the primitive types of the State.
	 */
	initialValue: OnlyPrimitive<State>;
	/**
	 * The actions is the function that contains all the actions of the store.
	 * - extract only the function types of the State.
	 */
	actions: (
		update: Writable<OnlyPrimitive<State>>['update'],
		set: Writable<OnlyPrimitive<State>>['set'],
		subscribe: Writable<OnlyPrimitive<State>>['subscribe']
	) => OnlyFunc<State>;
};
