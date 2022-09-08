import type { OnlyFunc, OnlyPrimitive } from './utils';

/**
 * Initial value of the store.
 */
type InitialValue<State> = State extends { $initialValue: infer T } ? T : OnlyPrimitive<State>;

/**
 * State of the store passed to actions by reference to handle the primitive types.
 * if T is Object then { current: InitialValue<State> } else InitialValue<State>
 */
export type ExState<State> = InitialValue<State> extends infer T
	? T extends Record<string, unknown> | Array<unknown>
		? InitialValue<State>
		: { current: InitialValue<State> }
	: never;

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
	 * - the type specify by only the primitive types of the State.
	 */
	initialValue: InitialValue<State>;
	/**
	 * The actions is the function that contains all the actions in the store.
	 * - the type specify by from only the function types of the State.
	 */
	actions?: (state: ExState<State>) => OnlyFunc<State>;
};
