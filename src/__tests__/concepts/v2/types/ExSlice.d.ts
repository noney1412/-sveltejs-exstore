import type { OnlyFunc, OnlyState , ImplyThis } from './Utils.d';
export interface Extensions {
	$name: string;
	$options: Record<string, unknown>;
}

export interface Init<State> {
	$init: State;
}

export type ExSlice<State> = Partial<State> & ImplyThis<OnlyFunc<State>> & Partial<Extensions>;
