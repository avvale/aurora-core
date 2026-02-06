import * as crypto from 'node:crypto';

export const sha1 = (data: string): string => {
  const generator = crypto.createHash('sha1');
  generator.update(data);

  return generator.digest('hex');
};
