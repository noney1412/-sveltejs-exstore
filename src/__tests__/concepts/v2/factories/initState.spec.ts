import { initState } from './initState';

describe('init state with initState<State>', () => {
	it('flatten: $init', () => {
		interface Count {
			$init: number;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = initState<Count>({
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

	it('flatten: $init with $name', () => {
		interface Count {
			$init: number;
			$name: string;
			increase: () => void;
			increaseBy: (by: number) => void;
			decrease: () => void;
			reset: () => void;
		}

		const state = initState<Count>({
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

	it('flatten: $init with $options', () => {
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

		const state = initState<Count>({
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

		const state = initState<Count>({
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
			$init: { value: 0 }
		});
	});

	it('flatten value: name, age with $name and $options', () => {
		interface Profile {
			name: string;
			age: number;
			changeName: (name: string) => void;
		}

		const state = initState<Profile>({
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
			$init: {
				name: 'John',
				age: 30
			}
		});
	});
});
