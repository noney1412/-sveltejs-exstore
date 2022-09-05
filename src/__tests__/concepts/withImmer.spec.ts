import exStore from '$lib';
import produce from 'immer';
import { get, Subscriber, Unsubscriber, Writable, writable } from 'svelte/store';

interface Profile {
	name: string;
	age: number;
}

test('stage 1: update profile state before immer.', () => {
	const profile = writable<Profile>({
		name: 'John Doe',
		age: 60
	});

	profile.update((state) => {
		state.name = 'Sam Wilson';
		return state;
	});

	expect(get(profile)).toMatchObject({
		name: 'Sam Wilson'
	});

	expect(get(profile).name).toBe('Sam Wilson');
	expect(get(profile).age).toBe(60);
});
test('stage 2: update profile state with immer', () => {
	const profile = writable<Profile>({
		name: 'John Doe',
		age: 60
	});

	const pass = (state: Profile) => {
		state.name = 'Sam Wilson';
	};

	profile.update((state) => {
		return produce(state, pass);
	});

	expect(get(profile).name).toBe('Sam Wilson');
});

test('stage 3: with immer and custom writable<Profile>', () => {
	interface WithImmerUpdater<State> extends Writable<State> {
		update: (updater: (state: State) => void) => void;
	}

	const store = writable<Profile>({ name: 'John Doe', age: 20 } as Profile);

	const immerStore: WithImmerUpdater<Profile> = {
		update: (updater) => {
			store.update((state) => {
				return produce(state, updater);
			});
		},
		set: store.set,
		subscribe: store.subscribe
	};

	immerStore.update((state) => {
		state.name = 'Sam Wilson';
	});

	expect(get(immerStore).name).toBe('Sam Wilson');
});

test('stage 4: exStore<Profile> with immerUpdate', () => {
	const profile = exStore<Profile>({
		name: 'profile',
		initialValue: { name: 'John Doe', age: 60 }
	});
});
