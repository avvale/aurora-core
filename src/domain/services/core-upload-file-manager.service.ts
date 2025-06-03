/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CoreFile, CoreFileUploaded } from '../types';
import { getRelativePathSegments, storagePublicAbsoluteDirectoryPath, storagePublicAbsolutePath, storagePublicAbsoluteURL, storageStream, uuid } from '../functions';
import { extname } from 'node:path';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import * as sharp from 'sharp';

@Injectable()
export class CoreUploadFileManagerService
{
    constructor(
        private readonly configService: ConfigService,
    ) {}

    async uploadFile(
        file: CoreFileUploaded,
        hasFileMeta = true,
    ): Promise<CoreFile>
    {
        // by default all files are saved in the tmp folder, so that after manipulation they are saved in the corresponding folder
        // if it is not necessary to manipulate the file, it can be saved directly in the corresponding folder.
        const relativePathSegments = getRelativePathSegments(file.relativePathSegments);
        const absoluteDirectoryPath = storagePublicAbsoluteDirectoryPath(relativePathSegments);

        // eslint-disable-next-line no-await-in-loop
        const { createReadStream, filename: originFilename, mimetype, encoding } = await file.file;
        const extensionFile = extname(originFilename).toLowerCase() === '.jpeg' ? '.jpg' : extname(originFilename).toLowerCase();
        const filename = `${file.id}${extensionFile}`;
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
            id        : file.id,
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
                fileMeta: hasFileMeta ? isCropable ? await sharp(absolutePath).metadata() : stats : undefined,
            },
        };

        // add cropable properties
        if (isCropable && file.hasCreateLibrary)
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
}