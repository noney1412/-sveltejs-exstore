export const isReadyForBrowser = async () => {
	if (typeof window !== 'undefined') return false;

	return true;
};
