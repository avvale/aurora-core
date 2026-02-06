import { join } from 'node:path';
import { storagePublicBasePath } from './storage-public-base-path.function';

export const storagePublicAbsoluteDirectoryPath = (
  relativePathSegments: string[],
): string => join(storagePublicBasePath(), ...relativePathSegments);
