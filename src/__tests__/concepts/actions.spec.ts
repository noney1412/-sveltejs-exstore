import type { InitialValue } from '$lib/types/ExSlice';
import type { WithImmerUpdater } from '$lib/types/ExUpdater';
import type { OnlyFunc } from '$lib/types/utils';
import { writable, Writable } from 'svelte/store';

export type ExSlice<State> = {
	name: string;

	initialValue: InitialValue<State>;

	actions: (state: InitialValue<State>) => OnlyFunc<State>;
};

function exStore<State>(slice: ExSlice<State>) {
	const initialValue = slice.initialValue;

	const { subscribe, update, set } = writable<InitialValue<State>>(initialValue);

	const actions = slice.actions(initialValue);

	console.log(actions);

	return {};
}

test('new action api', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: {} as Profile,
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});
});
