import exStore from '$lib';
import type { ExAction } from '$lib/types/ExAction';

interface Profile {
	name: string;
	age: number;
}

interface ProfileAction extends ExAction {
	exName: 'profile';
}
export const profile = exStore<Profile, ProfileAction>({} as Profile, (update, set) => ({
	exName: 'profile'
}));
