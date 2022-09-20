import type { ExMiddleware } from '$lib/types/ExMiddleware';
import { get, writable } from 'svelte/store';
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
	// eslint-disable-next-line @typescript-eslint/ban-types
	trace?: boolean | Function;
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

const traceStore = writable<string>(undefined);

const devtoolOptions = {
	name: getTitle() ?? 'no title',
	instanceId: getInstanceId(),
	shouldHotReload: false,
	trace: () => {
		const trace = get(traceStore);
		return trace || new Error('trace is not defined').stack;
	}
};

const shared = {
	devTool: initDevtool(devtoolOptions),
	stateToBeReset: '{}',
	liftedState: {
		actionsById: {},
		computedStates: [],
		currentStateIndex: 0,
		nextActionId: 0,
		skippedActionIds: [],
		stagedActionIds: []
	} as LIFTED_STATE,
	isSubscribed: false,
	isPaused: false,
	middlewareByName: new Map()
};

function withReduxDevtool<State>(middleware: ExMiddleware<State>) {
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
			const m: ExMiddleware<State> = middleware;
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

							if (shared.liftedState.skippedActionIds.includes(m.payload.actionId)) break;

							const state = JSON.parse(m.state);
							if (state instanceof Object) {
								Object.entries(state).forEach(([key, value]) => {
									if (shared.middlewareByName.has(key)) {
										const middleware = shared.middlewareByName.get(key);

										//FIXME: if the state is primitive type, it will not synchronize.
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
								const m: ExMiddleware<State> = middleware;
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

							updateStoreFormLifedState(m.payload.nextLiftedState);

							shared.devTool.send(null, m.payload.nextLiftedState);

							break;
						}

						case 'PAUSE_RECORDING': {
							const m: PAUSE_RECORDING = message as PAUSE_RECORDING;
							shared.isPaused = m.payload.status;

							const initialValue = {} as { [key: string]: unknown };

							if (m.payload.status === false) {
								shared.middlewareByName.forEach((middleware) => {
									const m: ExMiddleware<State> = middleware;
									initialValue[m.storeName] = get(m.store);
								});

								shared.devTool.init(initialValue);
							}
							break;
						}

						case 'TOGGLE_ACTION': {
							try {
								const liftedState = JSON.parse(message.state);

								shared.liftedState.skippedActionIds = _.union(shared.liftedState.skippedActionIds, [
									message.payload.id
								]) as number[];

								const next: LIFTED_STATE = {
									...shared.liftedState,
									...liftedState,
									skippedActionIds: shared.liftedState.skippedActionIds
								};

								shared.liftedState = next;

								shared.devTool.send(null, next);
							} catch (e) {
								throw new Error('Could not parse the message state');
							}

							break;
						}

						case 'SWEEP': {
							const toSweep = { ...shared.liftedState };

							// 1. sort action by id.
							const actionsById = Object.fromEntries(
								Object.entries(toSweep.actionsById)
									.filter(([key]) => !toSweep.skippedActionIds.includes(Number(key)))
									.map(([key, value], index) =>
										index === 0 ? [key, value] : [String(index), value]
									)
							);

							// 2. change stagedActionIds
							const stagedActionIds = Array.from(Array(Object.keys(actionsById).length).keys());

							// 3. filter computedStates
							const computedStates = toSweep.computedStates.filter(
								(_, index) => !toSweep.skippedActionIds.includes(index)
							);

							// 4. clear skippedActionIds
							const skippedActionIds = [];

							// 5. change nextActionId
							const nextActionId = stagedActionIds.length;

							// 6. change currentStateIndex
							const currentStateIndex = stagedActionIds.length - 1;

							const next: LIFTED_STATE = {
								actionsById,
								stagedActionIds,
								skippedActionIds,
								nextActionId,
								currentStateIndex,
								computedStates
							};

							shared.liftedState = { ...shared.liftedState, ...next };

							// update the state
							updateStoreFormLifedState(next);

							shared.devTool.send(null, next);
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

	function updateStoreFormLifedState(next: LIFTED_STATE) {
		const keys = Object.keys(next.computedStates[0].state);

		const currentIndex = next.currentStateIndex;

		const slice = _.slice(next.computedStates, 0, currentIndex + 1);

		keys.forEach((key) => {
			const value = slice.filter((item) => item.state[key]).pop()?.state[key];
			if (value) {
				if (shared.middlewareByName.has(key)) {
					const middleware = shared.middlewareByName.get(key);
					middleware.store.set(value);
				}
			}
		});
	}

	function update() {
		if (shared.middlewareByName.has(middleware.storeName)) {
			traceStore.set(middleware.trace || '');

			if (shared.isPaused) return;
			if (!shared.devTool) return;

			shared.devTool.send(
				{ type: `${middleware.storeName}/${middleware.currentActionName}` },
				{
					[middleware.storeName]: get(middleware.store)
				}
			);
		}
	}
}

export default withReduxDevtool;
