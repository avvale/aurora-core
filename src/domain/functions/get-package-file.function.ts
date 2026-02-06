import * as fs from 'node:fs';
import { LiteralObject } from '..';

export const getPackageFile = (): LiteralObject => {
  return JSON.parse(fs.readFileSync(process.cwd() + '/package.json', 'utf8'));
};
