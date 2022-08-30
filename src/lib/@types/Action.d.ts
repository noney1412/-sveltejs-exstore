/**
 * @param {string} type - the type of the action, will be displayed in the Redux DevTools.
 * @param {any} payload - the payload data.
 */
export type Action<T = any> = { type: string; payload?: T };
