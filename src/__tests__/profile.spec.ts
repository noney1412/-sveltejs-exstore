import { get } from 'svelte/store';
import { profile } from '../models/profile';
import { render } from '@testing-library/svelte';
import Profile from '../components/Profile.svelte';

test('parse profile object to json', () => {
	/**
	 * try to parse profile object to json.
	 */
	profile.set({ nameA: 'John Doe', age: 60 });
	expect(get(profile)).toEqual(JSON.stringify(get(profile)));
});

test('render Profile component', () => {
	render(Profile);
});
