import type { ExStore } from './ExSlice';

/**
 * @param {ExStore} store - the store to be enhanced.
 * @returns {ExStore} enhanced store.
 */
export type ExStoreEnhancer<T = any> = (store: ExStore<T>) => (store: ExStore<T>) => ExStore<T>;
