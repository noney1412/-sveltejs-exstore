import type { Writable } from 'svelte/store';

/**
 * A custom updater with provide immer utility.
 */
export interface WithImmerUpdater<State> extends Writable<State> {
	update: (updater: (state: State) => void) => void;
}
