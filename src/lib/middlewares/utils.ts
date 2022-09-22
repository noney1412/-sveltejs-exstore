export const isReadyForBrowser = async () => {
	const env = await import('$app/environment');
	if (env) if (!env.browser && !env.dev) return false;
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
