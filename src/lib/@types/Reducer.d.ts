import type { Action } from './Action';

/**
 * @param {string} state - current state.
 * @param {Action} action - action to be applied.
 */
export type Reducer<T = any> = (state?: T, action?: Action) => void;
