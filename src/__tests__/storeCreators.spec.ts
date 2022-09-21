import { analyzeMode, getOnlyStateFormSlice } from '$lib/storeCreators';

describe('storeCreators: analyzeMode, getOnlyStateFormSlice, getInitialState and getActionsFromSlice ', () => {
	it('analyzeMode: return primitive if the data is primitive', () => {
		const number = analyzeMode({ $init: 1 });
		expect(number).toBe('primitive');

		const nullable = analyzeMode({ $init: null });
		expect(nullable).toBe('primitive');

		const boolean = analyzeMode({ $init: true });
		expect(boolean).toBe('primitive');

		const string = analyzeMode({ $init: 'hello, world' });
		expect(string).toBe('primitive');

		const $undefined = analyzeMode({ $init: undefined });
		expect($undefined).toBe('primitive');
	});

	it('analyzeMode: return reference if the data is reference', () => {
		const emptyObject = analyzeMode({ $init: {} });
		expect(emptyObject).toBe('reference');

		const array = analyzeMode({ $init: [] });
		expect(array).toBe('reference');

		const nestedObject = analyzeMode({ $init: { a: 1 } });
		expect(nestedObject).toBe('reference');

		const profile = analyzeMode({ name: 'John', age: 30 });
		expect(profile).toBe('reference');

		const profileWithInit = analyzeMode({
			name: 'John',
			age: 30,
			$init: { name: 'John', age: 30 }
		});

		expect(profileWithInit).toBe('reference');
	});

	it('getOnlyStateFormSlice: return only state', () => {
		const profile = {
			$name: 'profile-store',
			$options: {},
			name: 'John',
			age: 30,
			changeName(name: string) {
				this.name = name;
			}
		};
		const onlyState = getOnlyStateFormSlice(profile);
		expect(onlyState).toEqual({ name: 'John', age: 30 });
	});
});
