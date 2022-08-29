import type { Writable } from 'svelte/store';
import type { ExStore } from '../@types/ExStore';

interface ReduxDevtools<T> {
	store: ExStore<T>;
	options?: { latency: number };
}

function withReduxDevtools<T = any>(
	store: ReduxDevtools<T>['store'],
	options: ReduxDevtools<T>['options'] = { latency: 100 }
) {
	return {};
}

export default withReduxDevtools;
