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
	serialize?:
		| boolean
		| {
				date?: boolean;
				regex?: boolean;
				undefined?: boolean;
				error?: boolean;
				symbol?: boolean;
				map?: boolean;
				set?: boolean;
				// eslint-disable-next-line @typescript-eslint/ban-types
				function?: boolean | Function;
		  };
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

const middlewareByName = new Map();

const root = {
	devTool: initDevtool({ name: getTitle() ?? 'no title', instanceId: 1441141, serialize: true }),
	isSubscribed: false
};

function withReduxDevtool<State>(middleware: Middleware<State>) {
	update();
	initStore();
	subscribeStore();

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

	function subscribeStore() {
		if (!isReadyForBrowser()) return;
		if (root.isSubscribed) return;
		if (!root.devTool) return;

		root.devTool.subscribe((message: any) => {
			console.log(message);
		});

		root.isSubscribed = true;
	}

	function update() {
		if (middlewareByName.has(middleware.storeName)) {
			const devTools = root.devTool;

			if (!devTools) return;

			devTools.send(
				{ type: `${middleware.storeName}/${middleware.currentActionName}` },
				get(middleware.store)
			);
		}
	}
}

export default withReduxDevtool;
