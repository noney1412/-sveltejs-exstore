export interface Options {
	$name: string;
	$options: Record<string, unknown>
}

export interface Init<State> {
	$init: State;
}

export type ExSlice<State> = State & Partial<Init<State>> & Partial<Options>;