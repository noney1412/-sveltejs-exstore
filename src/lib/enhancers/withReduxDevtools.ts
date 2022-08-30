import type { ExStore } from '../@types/ExStore';

type Options = { latency: number };

function withReduxDevtools<T>(store: ExStore<T>, options?: Options): ExStore<T> {
	return { store, hello: 'world' };
}

const store = withReduxDevtools({ name: 'test', initialValue: 0, reducers: {} });

export default withReduxDevtools;
