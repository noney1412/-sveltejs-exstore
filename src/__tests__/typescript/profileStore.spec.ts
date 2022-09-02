import { writable, Writable } from 'svelte/store';

type AnyVoidFunction = (...args: never[]) => void;

type PickFunctionFromObject<Props> = {
	[Key in keyof Props]: Props[Key] extends AnyVoidFunction ? Key : never;
}[keyof Props];

type OnlyFunc<T> = Pick<T, PickFunctionFromObject<T>>;

type OnlyProps<T> = Omit<T, PickFunctionFromObject<T>>;

interface ExSlice<State> {
	name: string;
	initialValue: OnlyProps<State>;
	actions: (update: Writable<OnlyProps<State>>['update']) => OnlyFunc<State>;
}

type ReturnExStore<State> = Writable<OnlyProps<State>> & OnlyFunc<State>;

interface Profile {
	name: string;
	age: number;
	changeName: (name: string) => void;
}

function exStore(slice: ExSlice<Profile>): ReturnExStore<Profile> {
	const { name, initialValue, actions } = slice;
	const store = writable<OnlyProps<Profile>>(initialValue);

	const { changeName } = actions(store.update);

	const customStore = {
		subscribe: store.subscribe,
		update: store.update,
		set: store.set,
		changeName
	};

	return customStore;
}

const profile = exStore({
	name: 'profile-store',
	initialValue: { name: 'John Doe', age: 60 },
	actions: (update) => ({
		changeName(name: string) {
			update((state) => ({
				...state,
				name
			}));
		}
	})
});

// update function conflicts with the update function from the actions

// expect to return Writable<Props> & Actions
