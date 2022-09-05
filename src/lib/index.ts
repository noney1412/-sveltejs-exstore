import produce from 'immer';
import { writable } from 'svelte/store';
import type { ExSlice } from './types/ExSlice';
import type { CreateExStore } from './types/ExStore';
import type { WithImmerUpdater } from './types/ExUpdater';

const exStore: CreateExStore = <State>(slice: ExSlice<State>) => {
	type InitialValue = typeof slice['initialValue'];

	const { subscribe, update, set } = writable<InitialValue>(slice.initialValue);

	const withImmerUpdate: WithImmerUpdater<InitialValue>['update'] = (updater) => {
		update((state) => {
			return produce(state, updater);
		});
	};

	const actions = slice.actions(withImmerUpdate, set, subscribe);

	return {
		subscribe,
		update: withImmerUpdate,
		set,
		...actions
	};
};

export default exStore;
