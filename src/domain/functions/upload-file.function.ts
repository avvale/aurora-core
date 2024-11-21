import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { extname } from 'node:path';
import * as sharp from 'sharp';
import { Utils } from '../shared/utils';
import { getRelativePathSegments } from './get-relative-path-segments.function';
import { storagePublicAbsoluteDirectoryPath } from './storage-public-absolute-directory-path.function';
import { storagePublicAbsolutePath } from './storage-public-absolute-path.function';
import { storagePublicAbsoluteURL } from './storage-public-absolute-url.function';

interface CoreFileUploaded {
    id: string;
    file: any;
    relativePathSegments?: string[];
    hasCreateLibrary?: boolean;
}

interface CoreFile {
    id: string;
    originFilename: string;
    filename: string;
    mimetype: string;
    extension: string;
    relativePathSegments: string[];
    width?: number;
    height?: number;
    size: number;
    url: string;
    isCropable: boolean;
    isUploaded: boolean;
    libraryId?: string;
    libraryFilename?: string;
    library?: CoreLibraryFile;
    meta?: any;
}

interface CoreLibraryFile {
    id: string;
    originFilename: string;
    filename: string;
    mimetype: string;
    extension: string;
    relativePathSegments: string[];
    width: number;
    height: number;
    size: number;
    url: string;
    meta?: any;
}

// CoreFileUploaded has relativePathSegments, that is an array
// of strings that represents the path to the file will be stored.
// by default, the file will be stored in the tmp directory.
export const uploadFile = async (file: CoreFileUploaded, hasFileMeta = true): Promise<CoreFile> =>
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
    await Utils.storageStream(absolutePath, stream);

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
        const libraryId = Utils.uuid();
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
};

export const uploadFiles = async (files: CoreFileUploaded[], hasFileMeta = true): Promise<CoreFile[]> =>
{
    const responses = [];
    for (const file of files)
    {
        const savedFile = await uploadFile(file, hasFileMeta);
        responses.push(savedFile);
    }
    return responses;
};
