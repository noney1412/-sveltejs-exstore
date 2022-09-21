import { analyzeMode, getInitialState, getOnlyStateFormSlice } from '$lib/storeCreators';

describe('storeCreators: analyzeMode, getOnlyStateFormSlice, getInitialState and getActionsFromSlice ', () => {
	it('analyzeMode: return bind-$init if the data is primitive', () => {
		const number = analyzeMode({ $init: 1 });
		expect(number).toBe('bind-$init');

		const nullable = analyzeMode({ $init: null });
		expect(nullable).toBe('bind-$init');

		const boolean = analyzeMode({ $init: true });
		expect(boolean).toBe('bind-$init');

		const string = analyzeMode({ $init: 'hello, world' });
		expect(string).toBe('bind-$init');

		const $undefined = analyzeMode({ $init: undefined });
		expect($undefined).toBe('bind-$init');
	});

	it('analyzeMode: return reference if the data is reference', () => {
		const emptyObject = analyzeMode({ $init: {} });
		expect(emptyObject).toBe('as-reference');

		const array = analyzeMode({ $init: [] });
		expect(array).toBe('as-reference');

		const nestedObject = analyzeMode({ $init: { a: 1 } });
		expect(nestedObject).toBe('as-reference');

		const profile = analyzeMode({ name: 'John', age: 30 });
		expect(profile).toBe('as-reference');

		const profileWithInit = analyzeMode({
			name: 'John',
			age: 30,
			$init: { name: 'John', age: 30 }
		});

		expect(profileWithInit).toBe('as-reference');
	});

	it('getOnlyStateFormSlice: return only state', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John',
			age: 30,
			changeName(name: string) {
				this.name = name;
			}
		};
		const onlyState = getOnlyStateFormSlice(profile);
		expect(onlyState).toEqual({ name: 'John', age: 30 });
	});

	it('getInitialState: in primitive mode return -> { $init: ... }', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John', // ignored in primitive mode.
			age: 30, // ignored in primitive mode.
			$init: {},
			changeName(name: string) {
				this.name = name;
			}
		};

		const state = getOnlyStateFormSlice(profile);
		const initialState = getInitialState(state, 'bind-$init');
		expect(initialState).toEqual({});
	});

	it('getInitialState: in reference mode return -> { ... }', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John',
			age: 30,
			changeName(name: string) {
				this.name = name;
			}
		};

		const state = getOnlyStateFormSlice(profile);
		const initialState = getInitialState(state, 'as-reference');
		expect(initialState).toEqual({ name: 'John', age: 30 });
	});
});
