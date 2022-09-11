import _ from "lodash";

test('deboucing with lodash', () => {
	const debounce = _.debounce((value: number) => {
		console.log(value);
	}, 1000);
});