export const objectToQueryParams = (obj: Record<string, any>): string => {
  const str = [];
  for (const property in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, property)) {
      str.push(
        encodeURIComponent(property) + '=' + encodeURIComponent(obj[property]),
      );
    }
  }
  return str.join('&');
};
