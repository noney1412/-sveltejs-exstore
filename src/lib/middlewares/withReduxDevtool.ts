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

// Trigger every time the middleware store is updated.
function withReduxDevtool<State>(
	middlewareObject: Middleware<State>,
	options: WithReduxDevtoolsOption = { name: 'update', latency: 100 }
) {
	// initialize Redux DevTools

	const devTools = initDevtool(options);

	if (!devTools) return;

	const { store, currentState, currentActionName, storeName } = middlewareObject;

	const INITIAL_STATE = get(store);

	let isInJumpToActionProgress = false;

	devTools.subscribe((message: any) => {
		if (message.type === 'DISPATCH' && message.payload.type === 'RESET') {
			store.set(INITIAL_STATE);
			devTools.init(currentState);
		}

		if (message.type === 'DISPATCH' && message.payload.type === 'COMMIT') {
			devTools.init(currentState);
		}

		if (message.type === 'DISPATCH' && message.payload.type === 'ROLLBACK') {
			console.log('rollback');
		}

		if (message.type === 'DISPATCH' && message.payload.type === 'JUMP_TO_ACTION' && message.state) {
			isInJumpToActionProgress = true;
			const state = JSON.parse(message.state);
			store.set(state);
		}
	});

	devTools.init(INITIAL_STATE);

	store.subscribe((state: any) => {
		const name = `${storeName}/${currentActionName}`;
		currentState;
		state;
		name;

		if (isInJumpToActionProgress) return;
		devTools.send(options.name, state);
	});
}

export default withReduxDevtool;
