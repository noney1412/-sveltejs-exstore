import { writable } from 'svelte/store';
import type { CreateExSlice, ExSlice } from './@types/ExSlice';
import type { ExStore } from './@types/ExStore';
import type { ExStoreEnhancer } from './@types/ExStoreEnhancer';
import withReduxDevtools from './enhancers/withReduxDevtools';

function exSlice<T>(
	{ name, initialValue, reducers }: ExSlice<T>,
	enhancers?: ExStoreEnhancer<T>[]
): CreateExSlice<T> {
	const { set, subscribe, update } = writable(initialValue);

	const store: ExStore<T> = {
		name,
		initialValue,
		subscribe,
		set,
		update,
		reducers
	};

	const toBeReduced = [withReduxDevtools<T>, ...(enhancers || [])];
	const withEnhancers = toBeReduced.reduce((next, enhancer) => enhancer(next), store) as ExStore<T>;

	return withEnhancers;
}

export default exSlice;
