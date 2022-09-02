/**
 * extract function type from type object.
 */
export type ExtractFunctionFromObject<Props> = {
	[Key in keyof Props]: Props[Key] extends AnyVoidFunction ? Key : never;
}[keyof Props];

/**
 * pick only function type from type object.
 */
export type OnlyFunc<T> = Pick<T, ExtractFunctionFromObject<T>>;

/**
 * pick only primitive type from type object.
 */
export type OnlyPrimitive<T> = Omit<T, ExtractFunctionFromObject<T>>;
