import { createWriteStream, unlink } from 'node:fs';

/**
 * @param path path to save file
 * @param stream stream to save
 * @returns Promise
 */
export const storageStream = (
  path: string | URL,
  stream: any,
): Promise<void> => {
  return new Promise((resolve: () => void, reject) => {
    // Create a stream to which the upload will be written.
    const writeStream = createWriteStream(path);

    // When the upload is fully written, resolve the promise.
    writeStream.on('finish', resolve);

    // If there's an error writing the file, remove the partially written file
    // and reject the promise.
    writeStream.on('error', (error) => {
      unlink(path, () => {
        reject(error);
      });
    });

    // In Node.js <= v13, errors are not automatically propagated between piped
    // streams. If there is an error receiving the upload, destroy the write
    // stream with the corresponding error.
    stream.on('error', (error) => writeStream.destroy(error));

    // Pipe the upload into the write stream.
    stream.pipe(writeStream);
  });
};
