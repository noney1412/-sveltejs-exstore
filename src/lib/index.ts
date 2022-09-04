import { writable } from 'svelte/store';
import type { ExSlice } from './types/ExSlice';
import type { CreateExStore } from './types/ExStore';
import type { OnlyPrimitive } from './types/utils';

const exStore: CreateExStore = <State>(slice: ExSlice<State>) => {
	const { subscribe, update, set } = writable<typeof slice['initialValue']>(slice.initialValue);

	const actions = slice.actions(update, set, subscribe);

	const store = {
		subscribe,
		update,
		set,
		...actions
	};

	return store;
};

export default exStore;
