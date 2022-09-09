export type MiddlewareObject<State> = {
	storeName: string;
	previousState: Nullable<State>;
	currentState: Nullable<State>;
	currentActionName: string;
	store: Writable<State>;
};
