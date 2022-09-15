import { browser, dev } from '$app/environment';

export const isReadyForBrowser = () => {
	if (!browser && !dev) return false;
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
