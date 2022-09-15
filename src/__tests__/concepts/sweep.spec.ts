test('sort array key', () => {
	const toSweep = {
		currentStateIndex: 6,
		nextActionId: 7,
		skippedActionIds: [5, 2],
		stagedActionIds: [0, 1, 2, 3, 4, 5, 6],
		actionsById: {
			'0': {
				action: {
					type: '@@INIT'
				},
				timestamp: 1663153321940,
				type: 'PERFORM_ACTION'
			},
			'1': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325096,
				type: 'PERFORM_ACTION'
			},
			'2': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325262,
				type: 'PERFORM_ACTION'
			},
			'3': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325433,
				type: 'PERFORM_ACTION'
			},
			'4': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325595,
				type: 'PERFORM_ACTION'
			},
			'5': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325760,
				type: 'PERFORM_ACTION'
			},
			'6': {
				action: {
					type: 'count/increase'
				},
				timestamp: 1663153325962,
				type: 'PERFORM_ACTION'
			}
		},
		computedStates: [
			{
				state: {
					count: 0,
					profile: {}
				}
			},
			{
				state: {
					count: 1
				}
			},
			{
				state: {
					count: 2
				}
			},
			{
				state: {
					count: 3
				}
			},
			{
				state: {
					count: 4
				}
			},
			{
				state: {
					count: 5
				}
			},
			{
				state: {
					count: 6
				}
			}
		]
	};

	// 1. sort action by id.
	const actionById = Object.fromEntries(
		Object.entries(toSweep.actionsById)
			.filter(([key]) => !toSweep.skippedActionIds.includes(Number(key)))
			.map(([key, value], index) => (index === 0 ? [key, value] : [String(index), value]))
	);

	// 2. change stagedActionIds
	const stagedActionIds = Array.from(Array(Object.keys(actionById).length).keys());

	// 3. filter computedStates
	const computedStates = toSweep.computedStates.filter(
		(_, index) => !toSweep.skippedActionIds.includes(index)
	);

	// 4. clear skippedActionIds
	const skippedActionIds = [];

	// 5. change nextActionId
	const nextActionId = stagedActionIds.length;

	// 6. change currentStateIndex
	const currentStateIndex = stagedActionIds.length - 1;

	const next = {
		actionById,
		stagedActionIds,
		skippedActionIds,
		nextActionId,
		currentStateIndex,
		computedStates
	};

	console.log(next);
});
