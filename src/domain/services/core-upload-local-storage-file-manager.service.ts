/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import * as sharp from 'sharp';
import { getRelativePathSegments, storagePublicAbsoluteDirectoryPath, storagePublicAbsolutePath, storagePublicAbsoluteURL, storageStream, uuid } from '../functions';
import { CoreFile, CoreFileUploaded } from '../types';
import { CoreUploadFileManagerService } from './core-upload-file-manager.service';

@Injectable()
export class CoreUploadLocalStorageFileManagerService implements CoreUploadFileManagerService
{
    constructor(
    ) {}

    async uploadFile(
        filePayload: CoreFileUploaded,
    ): Promise<CoreFile>
    {
        // by default all files are saved in the tmp folder, so that after manipulation they are saved in the corresponding folder
        // if it is not necessary to manipulate the file, it can be saved directly in the corresponding folder.
        const relativePathSegments = getRelativePathSegments(filePayload.relativePathSegments);
        const absoluteDirectoryPath = storagePublicAbsoluteDirectoryPath(relativePathSegments);

        // eslint-disable-next-line no-await-in-loop
        const { createReadStream, filename: originFilename, mimetype, encoding } = await filePayload.file;
        const extensionFile = extname(originFilename).toLowerCase() === '.jpeg' ? '.jpg' : extname(originFilename).toLowerCase();
        const filename = `${filePayload.id}${extensionFile}`;
        const absolutePath = storagePublicAbsolutePath(relativePathSegments, filename);

        // create directory if not exists
        if (!existsSync(absoluteDirectoryPath)) mkdirSync(absoluteDirectoryPath, { recursive: true });

        // Create readable stream
        const stream = createReadStream();

        // promise to store the file in the filesystem.
        // no await here to allow parallel uploads
        await storageStream(absolutePath, stream);

        // return the file url
        const url = storagePublicAbsoluteURL(relativePathSegments, filename);
        const stats = statSync(absolutePath);

        // check if file can do a crop action
        const isCropable = mimetype === 'image/jpeg' || mimetype === 'image/png' || mimetype === 'image/gif' || mimetype === 'image/webp';

        const coreFile: CoreFile = {
            id        : filePayload.id,
            originFilename,
            filename,
            mimetype,
            extension : extensionFile,
            relativePathSegments,
            size      : stats.size,
            url,
            isCropable,
            isUploaded: true,
            meta      : {
                fileMeta: isCropable ? await sharp(absolutePath).metadata() : stats,
            },
        };

        // add cropable properties
        if (isCropable && filePayload.hasCreateLibrary)
        {
            const libraryId = uuid();
            const filename = `${libraryId}${coreFile.extension}`;
            coreFile.libraryId = libraryId;
            coreFile.libraryFilename = filename;
            const absoluteLibraryPath = storagePublicAbsolutePath(relativePathSegments, filename);

            // copy file to create a library file
            copyFileSync(
                absolutePath,
                absoluteLibraryPath,
            );

            // set coreFile properties from cropable file
            coreFile.width = coreFile.meta.fileMeta.width;
            coreFile.height = coreFile.meta.fileMeta.height;
            coreFile.library = {
                id                  : libraryId,
                originFilename,
                filename,
                mimetype,
                extension           : extensionFile,
                relativePathSegments: coreFile.relativePathSegments,
                width               : coreFile.meta.fileMeta.width,
                height              : coreFile.meta.fileMeta.height,
                size                : coreFile.size,
                url                 : storagePublicAbsoluteURL(relativePathSegments, filename),
                meta                : {
                    fileMeta: coreFile.meta.fileMeta,
                },
            };
        }

        return coreFile;
    }

    async uploadFiles(
        filePayloads: CoreFileUploaded[],
    ): Promise<CoreFile[]>
    {
        const responses = [];
        for (const filePayload of filePayloads)
        {
            const savedFile = this.uploadFile(filePayload);
            responses.push(savedFile);
        }
        return Promise.all(responses);
    }
}