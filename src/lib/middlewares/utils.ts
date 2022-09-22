export const isReadyForBrowser = () => {
	if (typeof window === 'undefined') return false;

	return true;
};
