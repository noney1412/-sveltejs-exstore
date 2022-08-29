import { produce } from 'immer';

test('adapt immerjs', () => {
	const update = <T = any>(fn: (state: T) => void, state?: T) => {
		return produce(state, fn);
	};

	const count = {
		name: 'chanon',
		age: 20
	};

	const newCount = update<typeof count>((state) => {
		state.age = 30;
	}, count);

	console.log(newCount);
});
