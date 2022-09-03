import exStore from '$lib';
import { get } from 'svelte/store';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Profile from './Profile.svelte';

test('change profile name.', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: { name: 'John Doe', age: 60 },
		actions: (update) => ({
			changeName(name: string) {
				update((state) => ({
					...state,
					name
				}));
			}
		})
	});

	profile.changeName('Sam Wilson');

	expect(get(profile).name).toBe('Sam Wilson');
	expect(get(profile).age).toBe(60);
});

test('render <Profile /> and bind input with store.', async () => {
	render(Profile);
	const displayName = screen.getByTestId('display-name');
	const displayAge = screen.getByTestId('display-age');

	expect(displayName).toHaveTextContent('');
	expect(displayAge).toHaveTextContent('');

	const inputName = screen.getByTestId('input-name') as HTMLInputElement;
	const inputAge = screen.getByTestId('input-age') as HTMLInputElement;

	await fireEvent.input(inputName, { target: { value: 'Sam Wilson' } });
	await fireEvent.input(inputAge, { target: { value: 99 } });

	expect(displayName).toHaveTextContent('Sam Wilson');
	expect(displayAge).toHaveTextContent('99');
});
