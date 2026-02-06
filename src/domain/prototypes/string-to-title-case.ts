/**
 * Convert a string to Title Case.
 *
 * @example
 * 'hello world'.toTitleCase() // Will return `Hello World`.
 * 'fOO BAR'.toTitleCase()     // Will return `Foo Bar`.
 * 'fOÓ BAR'.toTitleCase()     // Will return `Foó Bar`.
 *
 * @returns {string}
 *   The Title Cased string.
 */
String.prototype.toTitleCase = function (this: string): string {
  return this.split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
