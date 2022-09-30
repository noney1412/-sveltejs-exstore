import {
	analyzeMode,
	getActionsFromSlice,
	getInitialState,
	getOnlyStateFormSlice,
	Mode
} from '$lib/storeCreators';

describe('storeCreators: analyzeMode, getOnlyStateFormSlice, getInitialState and getActionsFromSlice ', () => {
	it('analyzeMode: return bind-$init if the data is primitive', () => {
		const initMode: Mode = 'bind-$init';

		const number = analyzeMode({ $init: 1 });
		expect(number).toBe(initMode);

		const nullable = analyzeMode({ $init: null });
		expect(nullable).toBe(initMode);

		const boolean = analyzeMode({ $init: true });
		expect(boolean).toBe(initMode);

		const string = analyzeMode({ $init: 'hello, world' });
		expect(string).toBe(initMode);

		const $undefined = analyzeMode({ $init: undefined });
		expect($undefined).toBe(initMode);

		const emptyObject = analyzeMode({ $init: {} });
		expect(emptyObject).toBe(initMode);

		const array = analyzeMode({ $init: [] });
		expect(array).toBe(initMode);

		const nestedObject = analyzeMode({ $init: { a: 1 } });
		expect(nestedObject).toBe(initMode);
	});

	it('analyzeMode: return reference if the data is reference', () => {
		const referenceMode: Mode = 'as-reference';

		const profile = analyzeMode({ name: 'John', age: 30 });
		expect(profile).toBe(referenceMode);

		const profileWithInit = analyzeMode({
			name: 'John',
			age: 30
		});

		expect(profileWithInit).toBe(referenceMode);
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

	it('getInitialState: in bind-$init mode return -> { $init: ... }', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John', // ignored in bind-$init mode.
			age: 30, // ignored in bind-$init mode.
			$init: {},
			changeName(name: string) {
				this.name = name;
			}
		};

		const initMode: Mode = 'bind-$init';

		const state = getOnlyStateFormSlice(profile);
		const initialState = getInitialState(state, initMode);
		expect(initialState).toEqual({});
	});

	it('getInitialState: in as-reference mode return -> { ... }', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John',
			age: 30,
			changeName(name: string) {
				this.name = name;
			}
		};

		const referenceMode: Mode = 'as-reference';

		const state = getOnlyStateFormSlice(profile);
		const initialState = getInitialState(state, referenceMode);
		expect(initialState).toEqual({ name: 'John', age: 30 });
	});

	it('getActionsFromSlice: return only actions', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John',
			age: 30,
			changeName(name: string) {
				// actions 1
				this.name = name;
			},
			changeAge(age: number) {
				// actions 2
				this.age = age;
			}
		};

		const onlyActions = getActionsFromSlice(profile);
		expect(onlyActions).toEqual({ changeName: profile.changeName, changeAge: profile.changeAge });
	});

	it('getActionsFromSlice: bind actions to current slice', () => {
		const count = {
			$name: 'count-store',
			$init: 0,
			increment() {
				this.$init += 1;
			},
			double() {
				this.increment();
				this.increment();
			}
		};

		const actions = getActionsFromSlice(count);

		actions.double.bind(count)();

		expect(count.$init).toBe(2);
	});
});
