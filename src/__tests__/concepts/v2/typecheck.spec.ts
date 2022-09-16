import type { Options } from './types/ExSlice';
import type { OnlyFunc, OnlyState } from './types/Utils';

interface Profile {
	name: string;
	age: number;
	changeName(name: string): void;
	changeAge(age: number): void;
}

test('Extract Only Function Props', () => {
	const profile: Profile = {
		name: 'John Doe',
		age: 20,
		changeName(name: string) {
			this.name = name;
		},
		changeAge(age: number) {
			this.age = age;
		}
	};

	const $actions: OnlyFunc<Profile> = {
		changeName(name: string) {
			profile.name = name;
		},
		changeAge(age: number) {
			profile.age = age;
		}
	};

	$actions.changeName('new name');
	$actions.changeAge(30);

	expect(profile.name).toBe('new name');
	expect(profile.age).toBe(30);
});

test('Extract Only State Props', () => {
	const $state: OnlyState<Profile> = {
		name: 'John Doe',
		age: 20
	};

	$state.name = 'new name';
	$state.age = 30;

	expect($state.name).toBe('new name');
	expect($state.age).toBe(30);
});

test('Key in Options', () => {
	function isKeyOfObject<T>(key: string | number | symbol, obj: T): key is keyof T {
		return key in obj;
	}

	const options: Options = {
		$name: '',
		$options: {}
	};

	expect(isKeyOfObject('$name', options)).toBe(true);
	expect(isKeyOfObject('$options', options)).toBe(true);
});

test('Bind this from $state to $actions', () => {
	const $init: Profile = {
		name: 'John Doe',
		age: 20,
		changeName(name: string) {
			this.name = name;
		},
		changeAge(age: number) {
			this.age = age;
		}
	};

	const $state: OnlyState<Profile> = Object.fromEntries(
		Object.entries($init).filter(([, value]) => typeof value !== 'function')
	) as OnlyState<Profile>;

	const $actions: OnlyFunc<Profile> = {
		changeName: $init.changeName.bind($state),
		changeAge: $init.changeAge.bind($state)
	};

	$actions.changeName('new name');
	$actions.changeAge(30);

	expect($state.name).toBe('new name');
	expect($state.age).toBe(30);
});
