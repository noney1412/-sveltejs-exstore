import { get } from 'svelte/store';
import { render, fireEvent, screen } from '@testing-library/svelte';
import Profile from './Profile.svelte';
import { profile } from './profile';

test('change profile name.', () => {
	profile.changeName('Sam Wilson');
	profile.update((state) => {
		state.age = 30;
		return state;
	});

	expect(get(profile).name).toBe('Sam Wilson');
	expect(get(profile).age).toBe(30);
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
