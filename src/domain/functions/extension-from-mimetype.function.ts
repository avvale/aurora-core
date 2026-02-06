import * as mime from 'mime';

export const extensionFromMimetype = (mimetype: string): string => {
  return mime.getExtension(mimetype);
};
