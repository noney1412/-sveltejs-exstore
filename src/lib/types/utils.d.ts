export type AnyVoidFunction = (...args: never[]) => void;

/**
 * Extract function from object.
 */
export type ExtractFunctionFromObject<Props> = {
	[Key in keyof Props]: Props[Key] extends AnyVoidFunction ? Key : never;
}[keyof Props];

/**
 * Pick only function from object.
 */
export type OnlyFunc<T> = Pick<T, ExtractFunctionFromObject<T>>;

/**
 * Pick only primitive from object.
 */
export type OnlyPrimitive<T> = Omit<T, ExtractFunctionFromObject<T>>;
