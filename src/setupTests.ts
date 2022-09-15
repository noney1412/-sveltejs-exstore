import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');
	/**
	 * @type {import('$app/stores').getStores}
	 */
	const getStores = () => ({
		navigating: readable(null),
		page: readable({ url: new URL('http://localhost'), params: {} }),
		session: writable(null),
		updated: readable(false)
	});
	/** @type {typeof import('$app/stores').page} */
	const page = {
		subscribe(fn: () => void) {
			return getStores().page.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').navigating} */
	const navigating = {
		subscribe(fn: () => void) {
			return getStores().navigating.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').session} */
	const session = {
		subscribe(fn: () => void) {
			return getStores().session.subscribe(fn);
		}
	};
	/** @type {typeof import('$app/stores').updated} */
	const updated = {
		subscribe(fn: () => void) {
			return getStores().updated.subscribe(fn);
		}
	};
	return {
		getStores,
		navigating,
		page,
		session,
		updated
	};
});

vi.mock('$app/environment', async () => {
	/** @type {typeof import('$app/environment').browser} */
	const browser = true;
	/** @type {typeof import('$app/environment').dev} */
	const dev = true;
	/** @type {typeof import('$app/environment').prerendering} */
	const prerendering = false;

	return {
		browser,
		dev,
		prerendering
	};
});
