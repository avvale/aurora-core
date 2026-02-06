import { storagePublicAbsoluteDirectoryURL } from './storage-public-absolute-directory-url.function';

export const storagePublicAbsoluteURL = (
  relativePathSegments: string[],
  filename: string,
): string =>
  `${storagePublicAbsoluteDirectoryURL(relativePathSegments)}/${filename}`;
