import { get } from 'svelte/store';
import { profile } from '../models/profile';
import { fireEvent, render, screen } from '@testing-library/svelte';
import Profile from '$components/Profile.svelte';

test('parse profile object to json', () => {
	profile.set({ name: 'John Doe', age: 60 });
	expect(get(profile)).toEqual(JSON.stringify(get(profile)));
});

test('render Profile component and changing inputs binded with profile store.', async () => {
	render(Profile);
	const name = document.getElementsByTagName('h1')[0];
	const nameInput = screen.getByPlaceholderText('name');
	const age = document.getElementsByTagName('h2')[0];
	const ageInput = screen.getByPlaceholderText('age');

	await fireEvent.input(nameInput, { target: { value: 'Sam Will' } });
	await fireEvent.input(ageInput, { target: { value: '99' } });

	expect(name).toHaveTextContent('Sam Will');
	expect(age).toHaveTextContent('99');
});
