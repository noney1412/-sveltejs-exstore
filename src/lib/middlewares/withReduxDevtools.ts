import { browser, dev } from '$app/environment';
import type { Writable } from 'svelte/store';
import { get } from 'svelte/store';

interface WithReduxDevtoolsOption {
	name?: string;
	latency?: number;
}

function withReduxDevtools<T = any>(
	store: Writable<T>,
	options: WithReduxDevtoolsOption = { name: 'update', latency: 100 }
) {
	if (process.env.NODE_ENV !== 'production' && browser && dev) {
		if (!(typeof window !== 'undefined' && window)) return;

		const devTools =
			(window as any).window.__REDUX_DEVTOOLS_EXTENSION__ &&
			(window as any).__REDUX_DEVTOOLS_EXTENSION__.connect(options);
		if (!devTools) return;

		console.log('call from redux', store);

		const INITIAL_STATE = Object.assign({}, get(store));
		let currentState: T = INITIAL_STATE;
		let commitState: T;
		let isInJumpToActionProgress = false;

		devTools.subscribe((message: any) => {
			console.log(message);

			if (message.type === 'DISPATCH' && message.payload.type === 'RESET') {
				store.set(INITIAL_STATE);
				devTools.init(currentState);
				commitState = INITIAL_STATE;
			}

			if (message.type === 'DISPATCH' && message.payload.type === 'COMMIT') {
				devTools.init(currentState);
				commitState = currentState;
			}

			if (message.type === 'DISPATCH' && message.payload.type === 'ROLLBACK') {
				store.set(commitState);
				devTools.init(currentState);
			}

			if (
				message.type === 'DISPATCH' &&
				message.payload.type === 'JUMP_TO_ACTION' &&
				message.state
			) {
				isInJumpToActionProgress = true;
				const state = JSON.parse(message.state);
				store.set(state);
			}
		});

		devTools.init(INITIAL_STATE);

		store.subscribe((state) => {
			console.log('call inside redux subscribe', state, currentState);
			currentState = state;
			console.log('init', INITIAL_STATE);

			if (isInJumpToActionProgress) return;
			devTools.send(options.name, state);
		});
	}
}

export default withReduxDevtools;
