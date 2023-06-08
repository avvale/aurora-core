/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { CoreGetFallbackLangService } from '../../../domain';

@Injectable()
export class CoreGetFallbackLangHandler
{
    constructor(
        private readonly coreGetFallbackLangService: CoreGetFallbackLangService,
    ) {}

    async main()
    {
        return await this.coreGetFallbackLangService.get();
    }
}