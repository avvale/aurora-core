/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cache } from 'cache-manager';

@ApiTags('[core] langs')
@Controller('core/langs')
export class CoreLangsController
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get()
    @ApiOperation({ summary: 'Get langs' })
    @ApiCreatedResponse({ description: 'The record has been successfully returned.' })
    async main()
    {
        const langs = await this.cacheManager.get('common/langs');

        return langs;
    }
}