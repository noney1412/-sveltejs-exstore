import produce from 'immer';
import { get, writable } from 'svelte/store';

interface Profile {
	name: string;
	age: number;
}

test('update profile state before immer.', () => {
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

	console.log('without immer', get(profile));
});
test('update profile state with immer', () => {
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

	console.log('with immer', get(profile));
});
