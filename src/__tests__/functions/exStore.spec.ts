import exStore from '$lib';
import { get, writable } from 'svelte/store';

test('stage 1: with primitive initialValue', () => {
	interface Count {
		$initialValue: number;
		increase: () => void;
	}

	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0,
		actions: (state, update) => ({
			increase: () => update((state) => state + 1)
		})
	});

	expect(get(count)).toBe(0);

	count.increase();

	expect(get(count)).toBe(1);
});

test('stage 2: with object initialValue', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: {} as Profile,
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});

	expect(get(profile)).toEqual({});

	profile.changeName('John');

	expect(get(profile)).toEqual({ name: 'John' });
});

test('stage 3: with array initialValue', () => {
	interface Todo {
		id: number;
		title: string;
	}

	interface TodoList {
		$initialValue: Todo[];
		addTodo: (todo: Todo) => void;
	}

	const todoList = exStore<TodoList>({
		name: 'todo-list-test-store',
		initialValue: [] as Todo[],
		actions: (state) => ({
			addTodo(todo: Todo) {
				state.push(todo);
			}
		})
	});

	expect(get(todoList)).toEqual([]);

	todoList.addTodo({ id: 0, title: 'todo 1' });

	expect(get(todoList)).toEqual([{ id: 0, title: 'todo 1' }]);
});

test('stage 4: with nested object initialValue', () => {
	interface Todo {
		id: number;
		title: string;
	}

	interface TodoList {
		$initialValue: {
			todos: Todo[];
		};
		addTodo: (todo: Todo) => void;
	}

	const todoList = exStore<TodoList>({
		name: 'todo-list-test-store',
		initialValue: {
			todos: [] as Todo[]
		},
		actions: (state) => ({
			addTodo(todo: Todo) {
				state.todos.push(todo);
			}
		})
	});

	expect(get(todoList)).toEqual({ todos: [] });

	todoList.addTodo({ id: 0, title: 'todo 1' });

	expect(get(todoList)).toEqual({ todos: [{ id: 0, title: 'todo 1' }] });
});

test('stage 5: without actions', () => {
	interface Count {
		$initialValue: number;
	}

	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0
	});

	expect(get(count)).toBe(0);
});

test('stage 6: subscription of the primitive type', () => {
	// add primitive type to the store
	interface Count {
		$initialValue: number;
		increase: () => void;
		increaseBy: (by: number) => void;
		decrease: () => void;
	}

	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0,
		actions: (_, update) => ({
			increase: () => update((state) => state + 1),
			increaseBy: (by) => update((state) => state + by),
			decrease: () => update((state) => state - 1)
		})
	});

	// and subscribe to it
	const unsubscribe = count.subscribe((value) => {
		console.log('what is the value from subscription?', value);
	});

	// precondition
	expect(get(count)).toBe(0);
	// double update to make sure the subscription is working
	count.increase();
	expect(get(count)).toBe(1);
	count.increaseBy(2);
	expect(get(count)).toBe(3);
	count.decrease();
	expect(get(count)).toBe(2);

	// postcondition
	unsubscribe();
	count.increase();
});

test('stage 7: subscription of the reference type', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: {} as Profile,
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});

	const unsubscribe = profile.subscribe((value) => {
		console.log('what is the value from subscription?', value);
	});

	// precondition
	expect(get(profile)).toEqual({});
	profile.changeName('John');
	expect(get(profile)).toEqual({ name: 'John' });

	profile.update((state) => {
		state.age = 20;
		return state;
	});

	expect(get(profile)).toEqual({ name: 'John', age: 20 });
	// postcondition
	unsubscribe();
	profile.changeName('Jane');
});
