declare const Buffer: any;

export const base64Decode = (data: string): string => {
  return Buffer.from(data, 'base64').toString('utf-8');
};
