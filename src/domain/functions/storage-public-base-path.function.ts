import { join } from 'node:path';

export const storagePublicBasePath = (): string => join(process.cwd(), process.env.STORAGE_ACCOUNT_PUBLIC_PATH);