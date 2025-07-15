/**
 * Determines whether all unique elements of the first array (`arr1`) are contained within the second array (`arr2`).
 *
 * @typeParam T - The type of elements in the arrays.
 * @param arr1 - The array whose unique elements will be checked for containment.
 * @param arr2 - The array to check against for the presence of all unique elements from `arr1`.
 * @returns `true` if every unique element in `arr1` exists in `arr2`, otherwise `false`.
 *
 * @example
 * ```typescript
 * arraysContained([1, 2, 2], [1, 2, 3]); // returns true
 * arraysContained([1, 4], [1, 2, 3]);    // returns false
 * ```
 */
export const arraysContained = <T = any>(arr1: T[], arr2: T[]): boolean =>
{
    const arrayUniqueValues = new Set(arr2);
    return [...new Set(arr1)].every(x => arrayUniqueValues.has(x));
};
