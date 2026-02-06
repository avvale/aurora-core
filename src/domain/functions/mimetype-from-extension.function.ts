import * as mime from 'mime';

export const mimetypeFromExtension = (extension: string): string => {
  // set to lowercase and delete . character
  extension = extension.toLowerCase().replace(/\./g, '');

  return mime.getType(extension);
};
