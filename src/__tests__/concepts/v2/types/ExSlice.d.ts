import type { OnlyState, ImplyThis } from './Utils.d';
export interface Extensions {
	$name: string;
	$options: Record<string, unknown>;
}

export type ExSlice<State> = OnlyState<State> & ImplyThis<State> & Partial<Extensions>;
