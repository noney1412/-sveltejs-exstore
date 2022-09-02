import type { OnlyPrimitive } from './utils';

/**
 * exSlice is the parameter object for exStore.
 * @param name is the name of the store, which is used in devtools.
 * @initialValue is the initial value of the store by type State.
 * @actions is the function that contains all the actions of the store.
 */
export type ExSlice<State> = {
	name: string;
	initialValue: OnlyPrimitive<State>;
	actions: (update: Writable<OnlyPrimitive<State>>['update']) => OnlyFunc<State>;
};

