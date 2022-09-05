import exStore from '$lib';
import { get } from 'svelte/store';

test('stage 1: with primitive initialValue', () => {
	interface Count {
		$initialValue: number;
		increase: () => void;
	}

	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0,
		actions: (update) => ({
			increase() {
				update((state) => state + 1);
			}
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
		actions: (update) => ({
			changeName(name: string) {
				update((state) => {
					state.name = name;
				});
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
		actions: (update) => ({
			addTodo(todo: Todo) {
				update((state) => {
					state.push(todo);
				});
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
		actions: (update) => ({
			addTodo(todo: Todo) {
				update((state) => {
					state.todos.push(todo);
				});
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

	// @ts-expect-error
	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0
	});

	expect(get(count)).toBe(0);
});
