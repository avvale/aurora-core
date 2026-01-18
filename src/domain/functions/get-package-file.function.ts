import { LiteralObject } from '@domain/types';
import * as fs from 'node:fs';

export const getPackageFile = (): LiteralObject => {
    return JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
};
