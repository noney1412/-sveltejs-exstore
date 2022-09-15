import exStore from '$lib';

export interface Profile {
	name: string;
	age: number;
	changeName: (name: string) => void;
}

export const profile = exStore<Profile>({
	name: 'profile',
	initialValue: {} as Profile,
	actions: (state) => ({
		changeName(name: string) {
			state.name = name;
		}
	})
});
