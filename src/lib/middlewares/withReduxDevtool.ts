import { browser, dev } from '$app/environment';
import type { Middleware } from '$lib/types/ExMiddleware';
import { get } from 'svelte/store';

interface WithReduxDevtoolsOption {
	/**
	 * The name of the action to be displayed in the Redux DevTools.
	 */
	name?: string;
	/**
	 * The latency of the action to be displayed in the Redux DevTools.
	 * @default 100
	 */
	latency?: number;
}

function initDevtool(options: WithReduxDevtoolsOption = { name: 'update', latency: 100 }) {
	if (!browser && !dev) return undefined;
	if (!(typeof window !== 'undefined' && window)) return undefined;

	const devTools =
		(window as any).window.__REDUX_DEVTOOLS_EXTENSION__ &&
		(window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(options);

	return devTools;
}

const middlewareByName = new Map();

// Trigger every time the middleware store is updated.
function withReduxDevtool<State>(
	middleware: Middleware<State>,
	options: WithReduxDevtoolsOption = { name: 'update', latency: 100 }
) {
	// initialize Redux DevTools

	const devTools = initDevtool(options);

	if (!devTools) return;

	initStore();

	function initStore() {
		if (middlewareByName.has(middleware.storeName)) return;
		middlewareByName.set(middleware.storeName, middleware);

		const initialValue = {} as { [key: string]: any };

		middlewareByName.forEach((middleware, name) => {
			const { initialState } = middleware as Middleware<State>;
			initialValue[name] = initialState;
		});

		devTools.init(initialValue);
	}
}

export default withReduxDevtool;
