import type { ExSlice, Extensions } from '../lib/types/ExSlice';
import type { OnlyFunc, OnlyState } from '../lib/types/Utils';

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

	const options: Extensions = {
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

test('Infer undefined', () => {
	type CanBeUndefined<T> = T extends undefined ? true : false;

	const t1: CanBeUndefined<undefined> = true;

	expect(t1).toBe(true);

	const t2: CanBeUndefined<string> = false;

	expect(t2).toBe(false);
});

test('Infer $init', () => {
	type WithInit<T> = T extends { $init: infer U } ? U : never;

	type Profile = {
		name: string;
		$init: string;
	};

	const t1: WithInit<Profile> = 'John Doe';

	expect(t1).toBe('John Doe');
});

test('All or Nothing type', () => {
	interface Profile {
		name: string;
		age: number;
	}

	type AllOrNothing<T> =
		| T
		| {
				[k in keyof Required<T>]?: never;
		  };

	const slice: AllOrNothing<Profile> = {
		name: 'John Doe',
		age: 20
	};

	expect(slice.name).toBe('John Doe');
});

test('Imply this to function', () => {
	interface Profile {
		name: string;
		age: number;
		changeName(name: string): void;
	}

	type ImplyThis<T> = {
		[K in keyof T]: T[K] extends (...args: infer P) => infer R ? (this: T, ...args: P) => R : T[K];
	};

	const profile: ImplyThis<Profile> = {
		name: '',
		age: 0,
		changeName(name) {
			this.name = name;
		}
	};

	profile.changeName('new name');
});

test('Typecheck ExSlice<State> for reference type', () => {
	interface Profile {
		name?: string;
		age?: number;
		changeName(name: string): void;
	}

	const profile: ExSlice<Profile> = {
		name: 'John Doe',
		changeName(name) {
			this.name = name;
		}
	};

	profile.changeName('new name');

	expect(profile.name).toBe('new name');

	interface ProfileWithoutAction {
		name?: string;
		age?: number;
	}

	const profileWithOutAction: ExSlice<ProfileWithoutAction> = {};

	expect(profileWithOutAction.name).toBeUndefined();

	profileWithOutAction.name = 'new name';

	expect(profileWithOutAction.name).toBe('new name');
});

test('Typecheck ExSlice<State> for including $init', () => {
	interface Count {
		$init: number;
		increase(): void;
	}

	const count: ExSlice<Count> = {
		$init: 0,
		increase() {
			this.$init++;
		}
	};

	count.increase();

	expect(count.$init).toBe(1);
});

test('Higher order function to modify subscriber', () => {
	const customFunc = function (fn) {
		return (args) => {
			Object.freeze(args);
			return fn(args);
		};
	};

	const change = customFunc((value) => {
		value.a = 2;
	});

	const obj = {
		a: 999
	};

	expect(() => {
		change(obj);
	}).toThrowError();
});
