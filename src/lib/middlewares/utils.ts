export const isReadyForBrowser = async () => {
	const env = {
		browser: !import.meta.env.SSR ?? true,
		dev: __SVELTEKIT_DEV__ ?? true
	};

	if (!env.browser && !env.dev) return false;
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
