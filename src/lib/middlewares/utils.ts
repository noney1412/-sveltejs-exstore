export const isReadyForBrowser = async () => {
	const env = {
		browser: !import.meta.env.SSR,
		dev: __SVELTEKIT_DEV__
	};

	if (env) if (!env.browser && !env.dev) return false;
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
