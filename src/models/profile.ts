import exStore from '$lib';
import type { ExAction } from '$lib/types/ExAction';

interface Profile {
	nameA: string;
	age: number;
}

interface ProfileAction extends ExAction {
	name: 'profile';
	set: (x: Profile) => void;
}
export const profile = exStore<Profile | string, ProfileAction>(
	{
		nameA: 'John Doe',
		age: 25
	},
	(update, set) => ({
		name: 'profile',
		set: (x) => {
			set(JSON.stringify(x));
		}
	})
);
