declare const Buffer: any;

export const base64Encode = (data: string): string => {
  return Buffer.from(data).toString('base64');
};
