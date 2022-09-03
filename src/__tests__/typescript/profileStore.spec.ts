import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';




interface ExSlice<State> {
	name: string;
	initialValue: OnlyProps<State>;
	actions: (update: Writable<OnlyProps<State>>['update']) => OnlyFunc<State>;
}



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

test('profile store action', () => {
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

	profile.changeName('Sam Wilson');

	console.log(get(profile));
});
