/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CoreLangService } from '../../../domain/services/core-get-langs.service';

@Injectable()
export class CoreGetLangsHandler
{
    constructor(
        private readonly coreLangService: CoreLangService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async main()
    {
        return await this.coreLangService.get();
    }
}