/* eslint-disable max-len */
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync, readFileSync } from 'node:fs';
import { CoreBase64File, storagePublicAbsolutePath } from '../../../domain';

@Injectable()
export class CoreGetBase64FromFileService
{
    main(
        relativePathSegments: string[],
        filename: string,
    ): CoreBase64File
    {
        if (!filename) throw new BadRequestException('Filename to create blob must be defined');
        if (!Array.isArray(relativePathSegments)) throw new BadRequestException('RelativePathSegments to create blob must be defined and must be an array, current value: ' + relativePathSegments);

        const absoluteAttachmentPath = storagePublicAbsolutePath(relativePathSegments, filename);
        if (existsSync(absoluteAttachmentPath))
        {
            const fileData = readFileSync(absoluteAttachmentPath);
            const buffer = Buffer.from(fileData);
            return {
                base64: buffer.toString('base64'),
            }
        }

        throw new BadRequestException('Not found attachment file ' + absoluteAttachmentPath);
    }
}