import type { ExAction } from './ExAction';

/**
 * @param {string} state - current state.
 * @param {ExAction} action - action to be applied.
 */
export type Reducer<T = any> = (state: T, action?: ExAction) => void;
