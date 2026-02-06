/**
 * Determines whether two arrays have at least one element in common.
 *
 * @typeParam T - The type of elements in the arrays.
 * @param arr1 - The first array to compare.
 * @param arr2 - The second array to compare.
 * @returns `true` if there is at least one common element between `arr1` and `arr2`, otherwise `false`.
 *
 * @example
 * ```typescript
 * arraysIntersects([1, 2, 3], [3, 4, 5]); // returns true
 * arraysIntersects(['a', 'b'], ['c', 'd']); // returns false
 * ```
 */
export const arraysIntersects = <T = any>(arr1: T[], arr2: T[]): boolean => {
  const arrayUniqueValues = new Set(arr2);
  return [...new Set(arr1)].some((x) => arrayUniqueValues.has(x));
};
