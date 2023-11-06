import { join } from 'node:path';

export const storagePublicBasePath = (): string => join(process.cwd(), process.env.STORAGE_PUBLIC_PATH);