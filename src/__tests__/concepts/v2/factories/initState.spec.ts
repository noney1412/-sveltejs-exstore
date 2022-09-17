import { getState } from './initState';

describe('init state with initState<State>(slice: ExSlice<State>)', () => {
	it('should ', () => {
		//
	});
});

describe('get state with getState<State>(slice: ExSlice<State>)', () => {
	it('stage:1 flatten $init', () => {
		interface Count {
			$init: number;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = getState<Count>({
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

	it('stage:2 flatten $init with $name', () => {
		interface Count {
			$init: number;
			$name: string;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = getState<Count>({
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

	it('state:3 flatten $init with $options', () => {
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

		const state = getState<Count>({
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

	it('flatten value: number with $name and $options', () => {
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

		const state = getState<Count>({
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

	it('flatten value: name, age with $name and $options', () => {
		interface Profile {
			name: string;
			age: number;
			changeName: (name: string) => void;
		}

		const state = getState<Profile>({
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

	it('flatten value: $init, name with $name and $options', () => {
		interface Profile {
			name: string;
			age: number;
			rename(name: string): void;
			anyVoid(): void;
		}

		const withAction = getState<Profile>({
			anyVoid() {
				// ...
			},
			rename(name: string) {
				// ...
				name;
			}
		});

		expect(withAction).toEqual({});

		const withoutAction = getState<Profile>({
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

	it('flatten value: without actions', () => {
		interface Profile {
			name: string;
			age: number;
		}

		const profile = getState<Profile>({});

		expect(profile).toEqual({});
	});
});
