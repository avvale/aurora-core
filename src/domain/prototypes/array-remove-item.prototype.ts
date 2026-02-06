Array.prototype.removeItem = function <T>(values: T | T[]): Array<T> {
  if (!values) return [];

  const finalValues = Array.isArray(values) ? values : [values];

  return this.filter((item) => !finalValues.includes(item));
};
