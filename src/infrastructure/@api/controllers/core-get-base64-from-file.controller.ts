/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreGetBase64FromFileHandler } from '../handlers';

@ApiTags('[core] files')
@Controller('core/get-base64-from-file')
export class CoreGetBase64FromFileController
{
    constructor(
        private readonly handler: CoreGetBase64FromFileHandler,
    ) {}

    @Post()
    @HttpCode(200)
    @ApiOperation({ summary: 'Get base64 from file' })
    @ApiCreatedResponse({ description: 'The record has been successfully returned.' })
    main(
        @Body('relativePathSegments') relativePathSegments?: string[],
        @Body('filename') filename?: string,
    )
    {
        return this.handler.main(
            relativePathSegments,
            filename,
        );
    }
}
