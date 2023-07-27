/**
 * Checks an assertion. Throws if the assertion is failed.
 *
 * @param condition - Result of the assertion evaluation
 * @param message - Text to include in the exception message
 */
export function assert(condition, message) {
	if (!condition) {
		throw new Error('Assertion failed' + (message ? ': ' + message : ''));
	}
}

/**
 * Ensures that value is defined.
 * Throws if the value is undefined, returns the original value otherwise.
 *
 * @param value - The value, or undefined.
 * @returns The passed value, if it is not undefined
 */
// export function ensureDefined(value);
// export function ensureDefined(value);
export function ensureDefined(value) {
	if (value === undefined) {
		throw new Error('Value is undefined');
	}

	return value;
}

/**
 * Ensures that value is not null.
 * Throws if the value is null, returns the original value otherwise.
 *
 * @param value - The value, or null.
 * @returns The passed value, if it is not null
 */
// export function ensureNotNull(value);
// export function ensureNotNull(value);
export function ensureNotNull(value) {
	if (value === null) {
		throw new Error('Value is null');
	}

	return value;
}

/**
 * Ensures that value is defined and not null.
 * Throws if the value is undefined or null, returns the original value otherwise.
 *
 * @param value - The value, or undefined, or null.
 * @returns The passed value, if it is not undefined and not null
 */
// export function ensure(value);
// export function ensure(value);
export function ensure(value) {
	return ensureNotNull(ensureDefined(value));
}

/**
 * Compile time check for never
 */
export function ensureNever(value) {}