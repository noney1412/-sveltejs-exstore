export const isReadyForBrowser = () => {
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
