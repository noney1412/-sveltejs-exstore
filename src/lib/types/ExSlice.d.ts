import type { OnlyState, ImplyThis } from './Utils';
export interface Extensions {
	$name: string;
	$options: {
		devtools?: boolean;
	};
}

export type ExSlice<State> = OnlyState<State> & ImplyThis<State> & Partial<Extensions>;
