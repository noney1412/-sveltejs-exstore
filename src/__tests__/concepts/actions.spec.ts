/* eslint-disable prefer-const */
import type { InitialValue } from '$lib/types/ExSlice';
import type { OnlyFunc, OnlyPrimitive } from '$lib/types/utils';
import { get, writable } from 'svelte/store';

export type ExSlice<State> = {
	name: string;
	initialValue: InitialValue<State>;
	actions?: (state: InitialValue<State>) => OnlyFunc<State>;
};

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	let actions = slice.actions?.(initialValue) as WrappedActions;

	for (const [key, value] of Object.entries(actions)) {
		const fn = value as any;
		actions[key as keyof WrappedActions] = function (...args: unknown[]) {
			console.log(`${slice.name}/${key}`, args);
			update((state) => {
				fn(...args);
				return state;
			});
		};
	}

	return { subscribe, update, set, ...actions };
}

test('new action api', () => {
	interface Profile {
		name: string;
		age: number;
		changeName(name: string): void;
		changeProfile(profile: { name: string; age: number }): void;
		changeAge(age: number): void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: {} as Profile,
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			},
			changeProfile(profile) {
				state.name = profile.name;
				state.age = profile.age;
			},
			changeAge(age) {
				state.age = age;
			}
		})
	});

	profile.changeName('xxx');
	profile.changeName('yyy');
	profile.changeName('zzz');

	expect(get(profile).name).toBe('zzz');
	expect(get(profile).age).toBe(undefined);

	profile.changeProfile({ name: 'hello', age: 10 });

	expect(get(profile).name).toBe('hello');
	expect(get(profile).age).toBe(10);

	profile.changeAge(20);

	expect(get(profile).age).toBe(20);
});
