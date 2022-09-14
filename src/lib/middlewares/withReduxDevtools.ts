import type { Middleware } from '$lib/types/ExMiddleware';
import { get } from 'svelte/store';
import { isReadyForBrowser } from './utils';
import _ from 'lodash';

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
	shouldHotReload?: boolean;
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

type ROLLBACK = {
	type: string;
	payload: {
		type: string;
		timestamp: number;
	};
	state: string;
	id: string;
	source: string;
};

type IMPORT_STATE = {
	type: 'IMPORT_STATE';
	payload: {
		nextLiftedState: LIFTED_STATE;
	};
};

type LIFTED_STATE = {
	actionsById: {
		[key: string]: {
			action: { type: string };
			timestamp: number;
			type: 'PERFORM_ACTION';
		};
	};
	computedStates: { state: any }[];
	currentStateIndex: number;
	nextActionId: number;
	skippedActionIds: any[];
	stagedActionIds: number[];
};

type PAUSE_RECORDING = {
	type: string;
	payload: {
		type: string;
		status: boolean;
	};
	id: string;
	source: string;
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
		shouldHotReload: false
	}),
	stateToBeReset: '{}',
	isSubscribed: false,
	isPaused: false,
	skipActionIds: [],
	middlewareByName: new Map()
};

function withReduxDevtool<State>(middleware: Middleware<State>) {
	update();
	initStore();
	subscribeStore();

	async function initStore() {
		if (!isReadyForBrowser()) return;

		if (shared.middlewareByName.has(middleware.storeName)) return;
		shared.middlewareByName.set(middleware.storeName, middleware);

		if (!shared.devTool) return;

		const initialValue = {} as { [key: string]: unknown };

		shared.middlewareByName.forEach((middleware) => {
			const m: Middleware<State> = middleware;
			initialValue[m.storeName] = get(m.store);
		});

		shared.stateToBeReset = JSON.stringify(initialValue);

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
						case 'RESET': {
							const state = JSON.parse(shared.stateToBeReset);
							shared.devTool.init(state);
							Object.entries(state).forEach(([key, value]) => {
								if (shared.middlewareByName.has(key)) {
									const middleware = shared.middlewareByName.get(key);
									middleware.store.set(value);
								}
							});
							break;
						}
						case 'COMMIT': {
							const initialValue = {} as { [key: string]: unknown };

							shared.middlewareByName.forEach((middleware) => {
								const m: Middleware<State> = middleware;
								initialValue[m.storeName] = get(m.store);
							});

							shared.devTool.init(initialValue);
							break;
						}
						case 'ROLLBACK': {
							const m: ROLLBACK = message as ROLLBACK;
							const state = JSON.parse(m.state);
							Object.entries(state).forEach(([key, value]) => {
								if (shared.middlewareByName.has(key)) {
									const middleware = shared.middlewareByName.get(key);
									middleware.store.set(value);
								}
							});

							shared.devTool.init(state);
							break;
						}

						case 'IMPORT_STATE': {
							const m: IMPORT_STATE = message as IMPORT_STATE;

							const keys = Object.keys(m.payload.nextLiftedState.computedStates[0].state);

							const currentIndex = m.payload.nextLiftedState.currentStateIndex;

							const slice = _.slice(m.payload.nextLiftedState.computedStates, 0, currentIndex + 1);

							keys.forEach((key) => {
								const value = slice.filter((item) => item.state[key]).pop()?.state[key];
								if (value) {
									if (shared.middlewareByName.has(key)) {
										const middleware = shared.middlewareByName.get(key);
										middleware.store.set(value);
									}
								}
							});

							shared.devTool.send(null, m.payload.nextLiftedState);

							break;
						}

						case 'PAUSE_RECORDING': {
							const m: PAUSE_RECORDING = message as PAUSE_RECORDING;
							shared.isPaused = m.payload.status;

							const initialValue = {} as { [key: string]: unknown };

							if (m.payload.status === false) {
								shared.middlewareByName.forEach((middleware) => {
									const m: Middleware<State> = middleware;
									initialValue[m.storeName] = get(m.store);
								});

								shared.devTool.init(initialValue);
							}
							break;
						}

						case 'TOGGLE_ACTION': {
							try {
								const liftedState = JSON.parse(message.state);

								shared.skipActionIds = _.union(shared.skipActionIds, [message.payload.id]) as any;

								const next: LIFTED_STATE = {
									...liftedState,
									skippedActionIds: shared.skipActionIds
								};

								shared.devTool.send(null, next);
							} catch (e) {
								throw new Error('Could not parse the message state');
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

			if (shared.isPaused) return;

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
