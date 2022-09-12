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
	instanceId?: number | string;
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

type JUMP_TO_STATE = {
	type: 'DISPATCH';
	payload: {
		type: 'JUMP_TO_STATE' | 'JUMP_TO_ACTION';
		actionId: number;
	};
	state: string;
	id: string | number;
};

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

function getInstanceId() {
	if (!isReadyForBrowser()) return;

	return window.btoa(location.href);
}

const shared = {
	devTool: initDevtool({
		name: getTitle() ?? 'no title',
		instanceId: getInstanceId(),
		serialize: true
	}),
	isSubscribed: false,
	middlewareByName: new Map()
};

function withReduxDevtool<State>(middleware: Middleware<State>) {
	update();
	initStore();
	subscribeStore();

	function initStore() {
		if (!isReadyForBrowser()) return;

		if (shared.middlewareByName.has(middleware.storeName)) return;
		shared.middlewareByName.set(middleware.storeName, middleware);

		if (!shared.devTool) return;

		const initialValue = {} as { [key: string]: unknown };

		shared.middlewareByName.forEach((middleware) => {
			const m: Middleware<State> = middleware;
			initialValue[m.storeName] = get(m.store);
		});

		shared.devTool.init(initialValue);
	}

	function subscribeStore() {
		if (!isReadyForBrowser()) return;
		if (shared.isSubscribed) return;
		if (!shared.devTool) return;

		shared.devTool.subscribe((message: any) => {
			console.log(message);

			switch (message.type) {
				case 'DISPATCH': {
					switch (message.payload.type) {
						case 'JUMP_TO_STATE':
						case 'JUMP_TO_ACTION': {
							const m: JUMP_TO_STATE = message as JUMP_TO_STATE;
							const state = JSON.parse(m.state);
							switch (m.payload.actionId) {
								case 0: {
									if (state instanceof Object) {
										Object.entries(state).forEach(([key, value]) => {
											if (shared.middlewareByName.has(key)) {
												const middleware = shared.middlewareByName.get(key);
												middleware.store.set(value);
											}
										});
									}
									break;
								}
								default: {
									if (state instanceof Object) {
										Object.entries(state).forEach(([key, value]) => {
											if (shared.middlewareByName.has(key)) {
												const middleware = shared.middlewareByName.get(key);
												middleware.store.set(value);
											}
										});
									}
									break;
								}
							}
							break;
						}
					}
					break;
				}

				default:
					break;
			}
		});

		shared.isSubscribed = true;
	}

	function update() {
		if (shared.middlewareByName.has(middleware.storeName)) {
			const devTools = shared.devTool;

			if (!devTools) return;

			devTools.send(
				{ type: `${middleware.storeName}/${middleware.currentActionName}` },
				{
					[middleware.storeName]: get(middleware.store)
				}
			);
		}
	}
}

export default withReduxDevtool;
