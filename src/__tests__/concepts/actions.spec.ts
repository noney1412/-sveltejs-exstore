/* eslint-disable prefer-const */
import type { InitialValue } from '$lib/types/ExSlice';
import type { WithImmerUpdater } from '$lib/types/ExUpdater';
import type { OnlyFunc, ExtractFunctionFromObject, AnyVoidFunction } from '$lib/types/utils';
import { get, writable, Writable } from 'svelte/store';

export type ExSlice<State> = {
	name: string;

	initialValue: InitialValue<State>;

	actions: (state: InitialValue<State>) => OnlyFunc<State>;
};

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	type WrappedActions = OnlyFunc<State> & { [key: string]: any };

	let actions = slice.actions(initialValue) as WrappedActions;

	console.log(actions);

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
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: { name: 'john doe', age: 20 },
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});

	profile.subscribe((profile) => {
		console.log('from subscribe', profile);
	});

	profile.changeName('hello');
	profile.changeName('xxx');
	profile.changeName('yyy');
	profile.changeName('zzz');

	console.log(get(profile));
});

test('with profile ', () => {
	const profile = writable({ name: 'with profile name', age: 30 });

	profile.subscribe((profile) => {
		console.log('normal profile', profile);
	});

	profile.update((profile) => {
		profile.name = 'hello';
		return profile;
	});

	profile.update((profile) => {
		profile.name = 'lol';
		return profile;
	});

	profile.update((profile) => {
		profile.name = '3';
		return profile;
	});
});

test('wrap action', () => {
	interface Actions {
		changeName: (name: string) => void;
		increaseAge: () => void;
	}

	const actions: Actions = {
		changeName: function (name: string): void {
			console.log('change name actions', name);
		},
		increaseAge: function (): void {
			console.log('increase age action');
		}
	};

	let newActions: Actions = {} as Actions;

	for (const [key, value] of Object.entries(actions)) {
		const fn = value;
		newActions[key as keyof Actions] = function (...args: unknown[]) {
			console.log('before', key);
			fn(...args);
			console.log('after', key);
		};
	}

	newActions.changeName('hello');

	// 1. have to know Actions type
});
