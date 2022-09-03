/**
 * Extract function type from type object.
 */
export type ExtractFunctionFromObject<Props> = {
	[Key in keyof Props]: Props[Key] extends AnyVoidFunction ? Key : never;
}[keyof Props];

/**
 * Pick only function type from type object.
 */
export type OnlyFunc<T> = Pick<T, ExtractFunctionFromObject<T>>;

/**
 * Pick only primitive type from type object.
 */
export type OnlyPrimitive<T> = Omit<T, ExtractFunctionFromObject<T>>;
