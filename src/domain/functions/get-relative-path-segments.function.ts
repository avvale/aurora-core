export const getRelativePathSegments = (
  relativePathSegments: string[],
  defaultRelativePathSegments: string[] = ['tmp'],
): string[] => {
  return Array.isArray(relativePathSegments) && relativePathSegments.length > 0
    ? relativePathSegments
    : defaultRelativePathSegments;
};
