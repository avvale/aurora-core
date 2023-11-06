import { join } from 'node:path';

export const storagePublicAbsolutePath = (): string => join(process.cwd(), process.env.STORAGE_PUBLIC_PATH);