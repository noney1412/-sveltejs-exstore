import type { InitialValue } from '$lib/types/ExSlice';
import type { WithImmerUpdater } from '$lib/types/ExUpdater';
import type { OnlyFunc } from '$lib/types/utils';
import produce from 'immer';
import { writable, Writable } from 'svelte/store';

test('no action object needed for creating store', () => {
	interface Store<State> {
		initialValue: InitialValue<State>;
		actions?: (
			update: WithImmerUpdater<InitialValue<State>>['update'],
			set: Writable<InitialValue<State>>['set'],
			subscribe: Writable<InitialValue<State>>['subscribe']
		) => OnlyFunc<State>;
	}

	interface Init {
		$initialValue: number;
	}

	const store: Store<number> = {
		initialValue: 0
	};
});

test('no action object needed for return type of creating store function', () => {
	type ExStore<State> = WithImmerUpdater<ExSlice<State>['initialValue']> & Partial<OnlyFunc<State>>;

	type ExSlice<State> = {
		name: string;

		initialValue: InitialValue<State>;

		actions?: (
			update: WithImmerUpdater<InitialValue<State>>['update'],
			set: Writable<InitialValue<State>>['set'],
			subscribe: Writable<InitialValue<State>>['subscribe']
		) => OnlyFunc<State>;
	};

	function exStore<State>(slice: ExSlice<State>): ExStore<State> {
		type InitialValue = typeof slice['initialValue'];

		const { subscribe, update, set } = writable<InitialValue>(slice.initialValue);

		const withImmerUpdate: WithImmerUpdater<InitialValue>['update'] = (updater) => {
			update((state) => {
				return produce(state, updater);
			});
		};

		const actions = slice.actions?.(withImmerUpdate, set, subscribe) || {};
		return { subscribe, update: withImmerUpdate, set, ...actions };
	}
	interface Profile {
		name: string;
		age: number;
	}

	interface ProfileWithActions {
		name: string;
		age: number;
		setName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile',
		initialValue: { name: 'John Doe', age: 60 }
	});

	const profileWithSetName = exStore<ProfileWithActions>({
		name: 'profile',
		initialValue: { name: 'John Doe', age: 60 },
		actions: (update, set, subscribe) => ({
			setName: (name: string) => {
				update((state) => {
					state.name = name;
				});
			}
		})
	});

	profileWithSetName.setName!('Jane Doe');

	// if not provide actions then return WithImmerUpdater<ExSlice<State>['initialValue']>

	// if provide actions then return WithImmerUpdater<ExSlice<State>['initialValue']> & Partial<OnlyFunc<State>>;
});
