/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CoreGetLangsHandler } from '../handlers';

@ApiTags('[core] langs')
@Controller('core/langs')
export class CoreGetLangsController
{
    constructor(
        private readonly handler: CoreGetLangsHandler,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get langs' })
    @ApiCreatedResponse({ description: 'The record has been successfully returned.' })
    async main()
    {
        return await this.handler.main();
    }
}