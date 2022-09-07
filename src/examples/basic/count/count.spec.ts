import exStore from '$lib';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { get } from 'svelte/store';
import Count from './Count.svelte';

test('increase the number', () => {
	interface Count {
		$initialValue: number;
		increase: () => void;
	}

	const count = exStore<Count>({
		name: 'count',
		initialValue: 0,
		actions: (state) => ({
			increase: () => state + 1
		})
	});

	expect(get(count)).toBe(0);

	count.increase();

	expect(get(count)).toBe(1);
});

test('render <Count /> and fire click & input events.', async () => {
	render(Count);
	screen.logTestingPlaygroundURL();

	const number = screen.getByRole('heading', {
		name: /0/i
	});

	const numberBox = screen.getByRole('spinbutton');

	const decrease = screen.getByRole('button', {
		name: '-'
	});
	const increase = screen.getByRole('button', {
		name: '+'
	});

	const increaseBy = screen.getByRole('button', {
		name: /increase by 5/i
	});

	const reset = screen.getByRole('button', {
		name: /reset/i
	});

	await fireEvent.click(reset);

	expect(number).toHaveTextContent('0');

	await fireEvent.click(increase);

	expect(number).toHaveTextContent('1');

	await fireEvent.click(increaseBy);

	expect(number).toHaveTextContent('6');

	await fireEvent.click(decrease);

	expect(number).toHaveTextContent('5');

	await fireEvent.input(numberBox, { target: { value: 10 } });

	expect(number).toHaveTextContent('10');
});
