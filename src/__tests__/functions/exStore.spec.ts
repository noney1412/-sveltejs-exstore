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
		actions: (state) => ({
			increase: () => state.current + 1
		})
	});

	const unsubscribe = count.subscribe((value) => {
		console.log('stage 1: primitive count value', value);
	});

	expect(get(count)).toBe(0);

	count.increase();

	expect(get(count)).toBe(1);

	count.increase();

	expect(get(count)).toBe(2);

	count.update((state) => state + 1);

	expect(get(count)).toBe(3);

	count.set(4);

	expect(get(count)).toBe(4);

	count.set(-5);

	expect(get(count)).toBe(-5);

	unsubscribe();
});

test('stage 2: with object initialValue', () => {
	interface Profile {
		name: string;
		age: number;
		changeName: (name: string) => void;
	}

	const profile = exStore<Profile>({
		name: 'profile-test-store',
		initialValue: {},
		actions: (state) => ({
			changeName(name: string) {
				state.name = name;
			}
		})
	});

	const unsubscribe = profile.subscribe((value) => {
		console.log('stage 2: object profile value', value);
	});

	expect(get(profile)).toEqual({});

	profile.changeName('John');

	expect(get(profile)).toEqual({ name: 'John' });

	profile.set({ name: 'Jane', age: 20 });

	expect(get(profile)).toEqual({ name: 'Jane', age: 20 });

	// can be improved with immer.js
	profile.update((state) => {
		state = { name: 'Jack', age: 30 };
		return state;
	});

	expect(get(profile)).toEqual({ name: 'Jack', age: 30 });

	profile.set({});

	expect(get(profile)).toEqual({});

	unsubscribe();
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

	const unsubscribe = todoList.subscribe((value) => {
		console.log('stage 3: array todoList value', value);
	});

	todoList.addTodo({ id: 0, title: 'todo 0' });

	// expect(get(todoList)).toEqual([{ id: 0, title: 'todo 0' }]);

	todoList.addTodo({ id: 1, title: 'todo 1' });

	todoList.addTodo({ id: 2, title: 'todo 2' });

	expect(get(todoList)).toEqual([
		{ id: 0, title: 'todo 0' },
		{ id: 1, title: 'todo 1' },
		{ id: 2, title: 'todo 2' }
	]);

	unsubscribe();
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

	const unsubscribe = todoList.subscribe((value) => {
		console.log('stage 4: nested object todoList value', value);
	});

	expect(get(todoList)).toEqual({ todos: [] });

	todoList.addTodo({ id: 0, title: 'todo 0' });

	expect(get(todoList)).toEqual({ todos: [{ id: 0, title: 'todo 0' }] });

	todoList.addTodo({ id: 1, title: 'todo 1' });
	expect(get(todoList)).toEqual({
		todos: [
			{ id: 0, title: 'todo 0' },
			{ id: 1, title: 'todo 1' }
		]
	});

	todoList.addTodo({ id: 2, title: 'todo 2' });
	expect(get(todoList)).toEqual({
		todos: [
			{ id: 0, title: 'todo 0' },
			{ id: 1, title: 'todo 1' },
			{ id: 2, title: 'todo 2' }
		]
	});

	unsubscribe();
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
		actions: (state) => ({
			increase: () => state.current + 1,
			increaseBy: (by) => state.current + by,
			decrease: () => state.current - 1
		})
	});

	const unsubscribe = count.subscribe((value) => {
		console.log('stage 6: subscription of the primitive type', value);
	});

	expect(get(count)).toBe(0);

	count.increase();

	expect(get(count)).toBe(1);

	count.increaseBy(2);

	expect(get(count)).toBe(3);

	unsubscribe();
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

test('stage 8: immutable primitive', () => {
	interface Count {
		$initialValue: number;
		increase: () => void;
	}

	const count = exStore<Count>({
		name: 'count-test-store',
		initialValue: 0,
		actions: (state) => ({
			increase: () => state.current + 1
		})
	});

	const unsubscribe = count.subscribe((value) => {
		console.log('stage 8: immutable', value);
		value = 50;
	});

	count.increase();

	unsubscribe();
});

test('stage 9: immutable reference ', () => {
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
		console.log('stage 9: immutable reference', value);
		
		// FIXME: this should not work
		value.name = 'Jane';
	});

	profile.update((state) => {
		state.age = 20;
		return state;
	});

	unsubscribe();
});
