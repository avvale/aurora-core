import { arraysContained, arraysIntersects } from '../functions';

export class Arr {
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
  public static intersects<T = any>(arr1: T[], arr2: T[]): boolean {
    return arraysIntersects(arr1, arr2);
  }

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
  public static contained<T = any>(arr1: T[], arr2: T[]): boolean {
    return arraysContained(arr1, arr2);
  }

  /**
   * Removes specified items from an array.
   *
   * @template T - The type of elements in the array.
   * @param arr - The array from which items will be removed.
   * @param value - The item or array of items to remove from the array.
   * @returns A new array with the specified items removed. If `value` is falsy, returns an empty array.
   */
  public static removeItems<T = any>(arr: T[], value: T | T[]): T[] {
    let arrValues: T[];
    if (Array.isArray(value)) {
      arrValues = value;
    } else {
      if (value) {
        arrValues = [value];
      } else {
        return [];
      }
    }

    return arr.filter((ele) => !arrValues.includes(ele));
  }
}
