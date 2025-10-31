export class Str
{
    /**
     * Replaces parameter placeholders in a string with corresponding values from the provided object.
     *
     * Placeholders are defined using a colon followed by a key (e.g., `:id`). If a key exists in the `params` object,
     * its value will replace the placeholder; otherwise, the placeholder will remain unchanged.
     *
     * @param str - The string containing parameter placeholders to be replaced.
     * @param params - An object mapping parameter keys to their replacement values.
     * @returns The string with placeholders replaced by their corresponding values from `params`.
     *
     * @example
     * ```typescript
     * Str.replaceParams('Hello, :name!', { name: 'Alice' }); // returns 'Hello, Alice!'
     * Str.replaceParams('Order #:orderId', { orderId: 123 }); // returns 'Order #123'
     * Str.replaceParams('User: :user, Role: :role', { user: 'Bob' }); // returns 'User: Bob, Role: :role'
     * ```
     */
    public static replaceParams(str, params = {})
    {
        return str.replace(/:([a-zA-Z0-9_]+)/g, (_, key) =>
        {
            return params[key] !== undefined ? params[key] : `:${key}`;
        });
    }
}
