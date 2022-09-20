import ex from '$lib';

export interface Profile {
	name: string;
	age: number;
	changeName: (name: string) => void;
}

export const profile = ex<Profile>({
	$name: 'profile',
	name: 'John',
	age: 30,
	changeName(name: string) {
		this.name = name;
	}
});

