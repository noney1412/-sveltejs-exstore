import type { Reducer } from './ExReducer';
import type { ExStore } from './Store';
import type { ExStoreEnhancer } from './ExStoreEnhancer';

/**
 *	@param name - name of the store, will be displayed in Redux DevTools.
 *	@param initialValue - initial value state of the store.
 *	@param reducers - reducers to be applied to the store.
 *
 *	@example
 *	```typescript
 *	const countSlice: ExSlice<number> = {
 *			name: 'count',
 *			initialValue: 0,
 *			reducers: {
 *				increment: (state: number, action: Action) => { state + 1 },
 *				decrement: (state: number, action: Action) => { state - 1 }
 *			  increaseBy: (state: number, action: Action<number>) => { state + action.payload }
 *			}
 *	}
 *	```
 */
export interface ExSlice<TState = any> {
	name: string;
	initialValue: TState;
	reducers: {
		[key: string]: Reducer<TState>;
	};
}

/**
 * ExStore is a Svelte Store that can be used to create Redux-like stores.
 * @param {ExSlice} slice - the slice of the store.
 * @param {ExStoreEnhancer} [enhancers] - enhancers to be applied to the store.
 * @example
 * <caption>Create a slice</caption>
 * ```typescript
 * const count = exSlice({
 * 	name: 'count',
 * 	initialValue: 0,
 * 	reducers: {
 * 		increase: (state) {
 * 			state += 1;
 * 		},
 * 		decrease: (state) {
 * 			state -= 1;
 * 		},
 * 		increaseByValue: (state, action) {
 * 			state += action.payload;
 * 		}
 * 	}
 * })
 * ```
 */
export type CreateExSlice<T = any> = (
	slice: ExSlice<T>,
	enhancers?: ExStoreEnhancer<T>[] = []
) => ExStore<T>;
