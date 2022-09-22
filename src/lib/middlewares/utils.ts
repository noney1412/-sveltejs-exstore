export const isReadyForBrowser = async () => {
	if (!(typeof window !== 'undefined' && window)) return false;

	return true;
};
