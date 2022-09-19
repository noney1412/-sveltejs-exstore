import { get, writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { expectType } from 'vite-plugin-vitest-typescript-assert/tsd';
import { ex } from './ex';
import { bindActions, getCurrentState, initSharedState } from './factories/initSharedState';
import type { ExSlice } from './types/ExSlice';
import type { OnlyFunc } from './types/Utils';

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
		this.$init + by;
	},
	decrease() {
		this.$init - 1;
	},
	reset() {
		this.$init = 0;
	}
});

test('count should be a writable store', () => {
	expectType<Writable<unknown>>(count);
});

describe(`stage 1: (count) function: Subscribe, Update and Set`, () => {
	let unsubscribe: () => void;

	beforeAll(() => {
		unsubscribe = count.subscribe((value) => {
			expectType<number>(value as number);
			console.log('count: ', value);
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
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);
	});

	it('increaseBy', () => {
		count.update((c) => c + 2);
		expect(get(count)).toBe(2);
	});

	it('decrease', () => {
		count.update((c) => c - 1);
		expect(get(count)).toBe(-1);
	});

	it('reset', () => {
		count.update((c) => c + 1);
		expect(get(count)).toBe(1);

		count.update(() => 0);
		expect(get(count)).toBe(0);
	});
});

describe('stage 2: (count) function: actions', () => {
	beforeAll(() => {
		count.set(0);
		expect(get(count)).toBe(0);
	});

	it('increase', () => {
		count.increase();
		count.increase();
		console.log(count);
	});
});

describe('bound action to update state', () => {
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

		expect(state.bind).toBe(203);
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
