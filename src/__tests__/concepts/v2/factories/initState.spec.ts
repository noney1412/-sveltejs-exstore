import { analyzeMode, bindState } from './initState';

describe(`bind state with bindState<State>(slice: ExSlice<State>): SharedState<State>['bind']`, () => {
	it('case 1: only $init', () => {
		interface Count {
			$init: number;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = bindState<Count>({
			$init: 0,
			increase: () => {
				// ...
			},
			increaseBy: (by: number) => {
				// ..
				by;
			},
			decrease: () => {
				// ...
			},
			reset: () => {
				// ...
			}
		});

		expect(state).toEqual({ $init: 0 });
	});

	it('case 2: $init with $name', () => {
		interface Count {
			$init: number;
			$name: string;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = bindState<Count>({
			$init: 0,
			$name: 'count', // this is not part of the state
			increase: () => {
				// ...
			},
			increaseBy: (by: number) => {
				// ..
				by;
			},
			decrease: () => {
				// ...
			},
			reset: () => {
				// ...
			}
		});

		expect(state).toEqual({ $init: 0 });
	});

	it('case 3: $init with $options', () => {
		interface Count {
			$init: number;
			$options: {
				// ...
			};
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = bindState<Count>({
			$init: 0,
			$options: {
				// this is not part of the state
				// ...
			},
			increase: () => {
				// ...
			},
			increaseBy: (by: number) => {
				// ..
				by;
			},
			decrease: () => {
				// ...
			},
			reset: () => {
				// ...
			}
		});

		expect(state).toEqual({ $init: 0 });
	});

	it('case 4: number with $name and $options', () => {
		interface Count {
			value: number;
			$name: string;
			$options: {
				// ...
			};
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = bindState<Count>({
			value: 0,
			$name: 'count', // this is not part of the state
			$options: {
				// this is not part of the state
				// ...
			},
			increase: () => {
				// ...
			},
			increaseBy: (by: number) => {
				// ..
				by;
			},
			decrease: () => {
				// ...
			},
			reset: () => {
				// ...
			}
		});

		expect(state).toEqual({
			value: 0
		});
	});

	it('case 5: name, age with $name and $options', () => {
		interface Profile {
			name: string;
			age: number;
			changeName: (name: string) => void;
		}

		const state = bindState<Profile>({
			$name: 'profile', // this is not part of the state
			$options: {}, // this is not part of the state
			name: 'John',
			age: 30,
			changeName: (name: string) => {
				// ...
				name;
			}
		});

		expect(state).toEqual({
			name: 'John',
			age: 30
		});
	});

	it('case 6: $init, name with $name and $options', () => {
		interface Profile {
			name: string;
			age: number;
			rename(name: string): void;
			anyVoid(): void;
		}

		const withAction = bindState<Profile>({
			anyVoid() {
				// ...
			},
			rename(name: string) {
				// ...
				name;
			}
		});

		expect(withAction).toEqual({});

		const withoutAction = bindState<Profile>({
			name: '',
			rename(name: string) {
				this.name = name;
			},
			anyVoid() {
				// ...
			}
		});

		expect(withoutAction).toEqual({
			name: ''
		});
	});

	it('case 7: without actions', () => {
		interface Profile {
			name: string;
			age: number;
		}

		const profile = bindState<Profile>({});

		expect(profile).toEqual({});
	});

	it('case 8: only reference', () => {
		interface Profile {
			name: string;
			age: number;
		}

		const profile = bindState<Profile>({ name: 'John', age: 30 });

		expect(profile).toEqual({ name: 'John', age: 30 });
	});
});

describe('mode', () => {
	it('should return primitive when $init is primitive', () => {
		const slice = {
			$init: 0
		};

		const mode = analyzeMode(slice);

		expect(mode).toBe('primitive');
	});

	it('should return reference when $init is reference', () => {
		const slice = {
			$init: [0, 1, 2]
		};

		const mode = analyzeMode(slice);

		expect(mode).toBe('reference');
	});

	it('should return reference when without $init', () => {
		const slice = {
			name: '',
			age: ''
		};

		const mode = analyzeMode(slice);

		expect(mode).toBe('reference');
	});
});
