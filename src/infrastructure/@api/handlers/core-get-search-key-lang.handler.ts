/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { CoreGetSearchKeyLangService } from '../../../domain';

@Injectable()
export class CoreGetSearchKeyLangHandler
{
    constructor(
        private readonly coreGetSearchKeyLangService: CoreGetSearchKeyLangService,
    ) {}

    main()
    {
        return this.coreGetSearchKeyLangService.get();
    }
}