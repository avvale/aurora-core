/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreGetFallbackLangHandler } from '../handlers';

@ApiTags('[core] fallback lang')
@Controller('core/fallback-lang')
export class CoreGetFallbackLangController
{
    constructor(
        private readonly handler: CoreGetFallbackLangHandler,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get fallback lang' })
    @ApiCreatedResponse({ description: 'The record has been successfully returned.' })
    main()
    {
        return this.handler.main();
    }
}
