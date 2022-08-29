import { Writable, writable } from 'svelte/store';

interface ExSlice<T = any> {
	name: string;
	initialValue: T;
}

const exSlice = <TSlice, T = any>(slice: TSlice & ExSlice<T> & Record<string, any>) => {
	const { set, subscribe, update } = writable(slice.initialValue);

	for (const fn in slice) {
		console.log(typeof slice[fn] === 'function');
		console.log(fn);
	}

	const store: Writable<typeof slice.initialValue> & TSlice = {
		subscribe,
		set,
		update,
		...slice
	};

	return store;
};

export default exSlice;
