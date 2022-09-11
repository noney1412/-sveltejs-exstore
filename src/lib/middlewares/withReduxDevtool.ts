import type { Middleware } from '$lib/types/ExMiddleware';
import { get } from 'svelte/store';
import { isReadyForBrowser } from './utils';

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
	instanceId?: number;
}

function initDevtool(options: WithReduxDevtoolsOption = { name: 'anonymous', latency: 100 }) {
	if (!isReadyForBrowser()) return;

	const devTools =
		(window as any).window.__REDUX_DEVTOOLS_EXTENSION__ &&
		(window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(options);

	return devTools;
}

function getTitle() {
	if (!isReadyForBrowser()) return;

	return window.document.title;
}

function getDevtool() {
	if (!isReadyForBrowser()) return;

	return (window as any).__REDUX_DEVTOOLS_EXTENSION__;
}

const middlewareByName = new Map();

function withReduxDevtool<State>(middleware: Middleware<State>) {
	const root = {
		devTool: initDevtool({ name: getTitle() ?? 'no title', instanceId: 1 }),
		init: false
	};

	update();
	initStore();

	function initStore() {
		if (!isReadyForBrowser()) return;

		if (middlewareByName.has(middleware.storeName)) return;
		middlewareByName.set(middleware.storeName, middleware);

		if (!root.devTool) return;

		const initialValue = {} as { [key: string]: unknown };

		middlewareByName.forEach((middleware) => {
			const m: Middleware<State> = middleware;
			initialValue[m.storeName] = get(m.store);
		});

		root.devTool.init(initialValue);
	}

	function update() {
		if (middlewareByName.has(middleware.storeName)) {
			const devTools = initDevtool({ name: 'count', instanceId: 1 });

			if (!devTools) return;

			devTools.send(
				{ type: `${middleware.storeName}/${middleware.currentActionName}` },
				get(middleware.store)
			);
		}
	}
}

export default withReduxDevtool;
