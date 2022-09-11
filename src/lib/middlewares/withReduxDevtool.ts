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
function withReduxDevtool<State>(middleware: Middleware<State>) {
	// initialize Redux DevTools

	update();
	initStore();

	// trigger only when the store is init.
	function initStore() {
		if (middlewareByName.has(middleware.storeName)) return;
		middlewareByName.set(middleware.storeName, middleware);

		const devTools = initDevtool({
			name: middleware.storeName
		});

		if (!devTools) return;

		devTools.init(middleware.initialState);

		console.log(devTools);

		devTools.subscribe((message: any) => {
			console.log(message);
		});
	}

	function update() {
		if (middlewareByName.has(middleware.storeName)) {
			const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

			if (!devTools) return;

			devTools.send({ type: middleware.currentActionName }, get(middleware.store), [
				{
					name: 'count'
				}
			]);
		}
	}
}

export default withReduxDevtool;
