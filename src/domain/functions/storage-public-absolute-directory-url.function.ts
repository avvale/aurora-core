import { storagePublicBaseURL } from './storage-public-base-url.function';

export const storagePublicAbsoluteDirectoryURL = (relativePathSegments: string[]): string => `${storagePublicBaseURL()}/${relativePathSegments.join('/')}`;