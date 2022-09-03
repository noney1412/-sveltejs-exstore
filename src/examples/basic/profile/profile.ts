import exStore from '$lib';

export interface Profile {
	name: string;
	age: number;
	changeName: (name: string) => void;
}

export const profile = exStore<Profile>({
	name: 'profile-test-store',
	initialValue: {} as Profile,
	actions: (update) => ({
		changeName(name: string) {
			update((state) => ({
				...state,
				name
			}));
		}
	})
});
