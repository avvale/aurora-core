import { join } from 'node:path';
import { storagePublicBasePath } from './storage-public-base-path.function';

export const storagePublicAbsolutePath = (relativePathSegments: string[], filename: string): string => join(storagePublicBasePath(), ...relativePathSegments, filename);