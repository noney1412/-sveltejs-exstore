import exStore from '../../lib/exStore.mjs';
import { get } from 'svelte/store';

test('encode to json and parse to object', () => {
	const profile = exStore({}, (update, set) => ({
		exName: 'profile',
		set: (value) => {
			set(JSON.stringify(value));
		}
	}));

	const profileData = { name: 'John Doe', age: 60 };
	profile.set(profileData);
	expect(JSON.parse(get(profile))).toMatchObject(profileData);
});
