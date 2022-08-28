import type { Writable } from 'svelte/store';

/**
 * @param {string} type - the type of the action, will be displayed in the Redux DevTools.
 * @param {any} payload - the payload data.
 */
export type Action<T = any> = { type: string; payload?: T };

/**
 * @param {string} state - current state.
 * @param {Action} action - action to be applied.
 */
export type Reducer<T = any> = (state?: T, action?: Action) => void;

/**
 * @param name - name of the store, will be displayed in Redux DevTools.
 * @param initialValue - initial value state of the store.
 * @param reducers - reducers to be applied to the store.
 */
export interface ExSlice<T = any> {
	name: string;
	initialValue: T;
	reducers: {
		[key: string]: Reducer<T>;
	};
}

/**
 * ExStore is a Svelte Store that can be used to create Redux-like stores.
 *
 * @example
 * <caption>Create a slice</caption>
 * ```typescript
 *	const count = exSlice({
 *		name: 'count',
 *		initialValue: 0,
 *		reducers: {
 *			increase: (state) {
 *				state += 1;
 *			},
 *			decrease: (state) {
 *				state -= 1;
 *			},
 *			increaseByValue: (state, action) {
 *				state += action.payload;
 *			}
 *		}
 *	})
 * ```
 */
export type CreateExSlice<T = any> = (
	slice: ExSlice<T>,
	enhancers?: ExStoreEnhancer<T>[] = []
) => ExSlice<T>;

/**
 * ExStore is a Svelte Store that can be used to create Redux-like stores.
 * with the integration of the Redux DevTools extension.
 */
export type ExStore = Writable<T> & ExSlice<T>;

/**
 * @param {ExStore} store - the store to be enhanced.
 * @returns {ExStore} enhanced store.
 */
export type ExStoreEnhancer<T = any> = (store: ExSlice<T>) => (store: ExSlice) => ExSlice<T>;
