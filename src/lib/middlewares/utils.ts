export const isReadyForBrowser = async () => {
	if (!window) return false;
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
