test('with plugins', () => {
	const enhancers = [(store: string) => store];

	const withEnhancers = enhancers.reduce((store, enhancer) => enhancer(store), 'test');

	console.log(withEnhancers);
});
