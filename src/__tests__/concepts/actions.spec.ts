import type { InitialValue } from '$lib/types/ExSlice';
import type { WithImmerUpdater } from '$lib/types/ExUpdater';
import type { OnlyFunc } from '$lib/types/utils';
import { get, writable, Writable } from 'svelte/store';

export type ExSlice<State> = {
	name: string;

	initialValue: InitialValue<State>;

	actions: (state: InitialValue<State>) => OnlyFunc<State>;
};

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	const actions = slice.actions(initialValue);

	console.log(actions);

	return { subscribe, update, set, ...actions };
}

test('new action api', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: { name: 'john doe', age: 20 },
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});

	profile.subscribe((profile) => {
		console.log(profile);
	});

	profile.changeName('hello');
	profile.changeName('xxx');
	profile.changeName('yyy');
	profile.changeName('zzz');

	console.log(get(profile));
});

test('with profile ', () => {
	const profile = writable({ name: 'with profile name', age: 30 });

	profile.subscribe((profile) => {
		console.log('normal profile', profile);
	});

	profile.update((profile) => {
		profile.name = 'hello';
		return profile;
	});

	profile.update((profile) => {
		profile.name = 'lol';
		return profile;
	});

	profile.update((profile) => {
		profile.name = '3';
		return profile;
	});
});
