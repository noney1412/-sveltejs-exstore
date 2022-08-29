import exSlice from '$lib';
import type { ExSlice } from '$lib/@types/ExSlice';
import type { ExStore } from '$lib/@types/ExStore';
import type { Action } from '@sveltejs/kit';
import { writable } from 'svelte/store';

test('default enhancer should be worked', () => {
	const store: ExStore<number> = exSlice<number>({
		name: 'counter',
		initialValue: 0,
		reducers: {
			increment: () => {
				console.log('dispatch increment');
			}
		}
	});

	store.hello
	console.log(store);
});
