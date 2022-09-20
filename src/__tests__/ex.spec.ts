import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd';
import { bindActions, getCurrentState, initSharedState } from '../lib/initSharedState';
import type { ExSlice } from '../lib/types/ExSlice';
import type { OnlyFunc } from '../lib/types/Utils';
import ex from '$lib';

interface Count {
	$init: number;
	increase: () => void;
	increaseBy: (by: number) => void;
	decrease: () => void;
	reset: () => void;
}

const count = ex<Count>({
	$name: 'count-store',
	$init: 0,
	increase() {
		this.$init += 1;
	},
	increaseBy(by) {
		this.$init += by;
	},
	decrease() {
		this.$init -= 1;
	},
	reset() {
		this.$init = 0;
	}
});

interface Profile {
	name: string;
	age: number;
	setName: (name: string) => void;
}

const profile = ex<Profile>({
	$name: 'profile-store',
	name: 'John',
	age: 30,
	setName(name) {
		this.name = name;
	}
});

test('count should be a writable store', () => {
	expectType<Writable<number>>(count);
});

describe(`stage 1: (count) function: Subscribe, Update and Set`, () => {
	let unsubscribe: () => void;

	beforeAll(() => {
		unsubscribe = count.subscribe((value) => {
			expectType<number>(value);
			console.log('stage 1: count = ', value);
		});
	});

	beforeEach(() => {
		count.set(0);
		expect(get(count)).toBe(0);
	});

	afterAll(() => {
		unsubscribe();
		count.set(0);
		expect(get(count)).toBe(0);
	});

	it('increase by update', () => {
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);
		count.update((c) => c + 50);
		expect(get(count)).toBe(51);
	});

	it('decrease by update', () => {
		count.update((c) => c - 1);
		expect(get(count)).toBe(-1);
	});

	it('reset by update', () => {
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);

		count.update(() => 0);
		expect(get(count)).toBe(0);
	});
});

describe('stage 2: (count) function: Actions', () => {
	let unsubscribe: () => void;

	beforeAll(() => {
		unsubscribe = count.subscribe((value) => {
			expectType<number>(value);
			console.log('stage 2: count = ', value);
		});
	});

	beforeEach(() => {
		count.set(0);
		expect(get(count)).toBe(0);
	});

	afterAll(() => {
		unsubscribe();
		count.set(0);
		expect(get(count)).toBe(0);
	});

	it('increase', () => {
		count.increase();
		count.increase();
		expect(get(count)).toBe(2);
	});

	it('increaseBy', () => {
		count.increaseBy(2);
		count.increaseBy(2);
		expect(get(count)).toBe(4);
	});
});

describe('bind action to update function from store', () => {
	it('wrap action to update primitive to writable store', () => {
		const count: ExSlice<Count> = {
			$name: 'count-store',
			$init: 0,
			increase() {
				this.$init += 1;
			},
			increaseBy(by) {
				this.$init += by;
			},
			decrease() {
				this.$init -= 1;
			},
			reset() {
				this.$init = 0;
			}
		};

		const state = initSharedState(count);

		const store = writable(state.initialState);

		const actions = bindActions(state.bind, count);

		const boundActions = Object.keys(actions).reduce((acc, key) => {
			const fn = actions[key];
			acc[key] = function (...args: unknown[]) {
				store.update((prev) => {
					fn.apply(prev, args);
					const newState = getCurrentState(state);
					return newState;
				});
			};
			return acc;
		}, {}) as OnlyFunc<Count>;

		boundActions.increase();
		boundActions.increase();
		boundActions.increase();
		boundActions.increaseBy(200);

		expect(state.bind.$init).toBe(203);
		expect(get(store)).toBe(203);
	});

	it('wrap action to update reference to writable store.', () => {
		interface Profile {
			name: string;
			age: number;
			changeName: (name: string) => void;
		}

		const profile: ExSlice<Profile> = {
			$name: 'profile',
			name: 'John',
			age: 20,
			changeName(name) {
				this.name = name;
			}
		};

		const state = initSharedState(profile);

		const store = writable(state.initialState);

		const actions = bindActions(state.bind, profile);

		const boundActions = Object.keys(actions).reduce((acc, key) => {
			const fn = actions[key];
			acc[key] = function (...args: unknown[]) {
				store.update((prev) => {
					fn.apply(prev, args);
					const newState = getCurrentState(state);
					return newState;
				});
			};
			return acc;
		}, {}) as OnlyFunc<Profile>;

		boundActions.changeName('Jane');

		expect(state.bind).toEqual({
			name: 'Jane',
			age: 20
		});

		expect(get(store)).toEqual({
			name: 'Jane',
			age: 20
		});
	});
});

describe('stage 3: primitive(count): use actions to update state', () => {
	let unsubscribe: () => void;
	beforeAll(() => {
		unsubscribe = count.subscribe((value) => {
			expectType<number>(value);
			console.log('stage 3: count = ', value);
		});

		count.set(0);
		expect(get(count)).toBe(0);
	});

	afterEach(() => {
		count.reset();
		expect(get(count)).toBe(0);
	});

	afterAll(() => {
		unsubscribe();
		count.set(0);
		expect(get(count)).toBe(0);
	});
	it('increase', () => {
		count.increase();
		expect(get(count)).toBe(1);
		count.increase();
		expect(get(count)).toBe(2);
	});

	it('increaseBy', () => {
		count.increaseBy(2);
		expect(get(count)).toBe(2);
		count.increaseBy(2);
		expect(get(count)).toBe(4);
	});
});

describe('stage 4: reference(profile): use actions to update state', () => {
	let unsubscribe: () => void;

	beforeAll(() => {
		unsubscribe = profile.subscribe((value) => {
			console.log('stage 4: profile = ', value);
		});
	});

	afterEach(() => {
		profile.set({} as Profile);
		expect(get(profile)).toEqual({});
	});

	afterAll(() => {
		unsubscribe();
	});

	it('set name', () => {
		profile.setName('Jane');
		expect(get(profile)).toEqual({
			name: 'Jane',
			age: 30
		});
	});
});
