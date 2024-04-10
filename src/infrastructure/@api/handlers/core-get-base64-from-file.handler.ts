/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { CoreGetBase64FromFileService } from '../../shared/services/core-get-base64-from-file.service';

@Injectable()
export class CoreGetBase64FromFileHandler
{
    constructor(
        private readonly coreGetBase64FromFileService: CoreGetBase64FromFileService,
    ) {}

    main(
        relativePathSegments: string[],
        filename: string,
    )
    {
        return this.coreGetBase64FromFileService.main(
            relativePathSegments,
            filename,
        );
    }
}
