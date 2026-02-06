export class DateTime {
  // YYYY-MM-DD HH:mm:ss
  static TIMESTAMP_REGEX =
    /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/;

  /**
   * Determines whether the provided value is a string that matches the expected timestamp format.
   *
   * @param value - The value to check.
   * @returns `true` if the value is a string and matches the timestamp regular expression; otherwise, `false`.
   */
  public static isTimestamp(value: unknown): boolean {
    return typeof value === 'string' && DateTime.TIMESTAMP_REGEX.test(value);
  }
}
