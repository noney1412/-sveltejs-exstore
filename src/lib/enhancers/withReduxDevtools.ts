import type { ExStore } from '../@types/ExStore';

type Options = { latency: number };

function withReduxDevtools<T>(store: ExStore<T>, options?: Options): ExStore<T> {
	return { store, hello: 'world' };
}

export default withReduxDevtools;
