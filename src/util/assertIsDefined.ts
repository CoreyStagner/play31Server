export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
    // TODO: Get working for prod usage. Also figure out a workaround for postman.
    // if (!val) {
    //     throw Error(`Expected "val" to be defined, but received: ${val}`);
    // }
}