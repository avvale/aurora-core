/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { CoreGetLangsService } from '../../../domain';

@Injectable()
export class CoreGetLangsHandler
{
    constructor(
        private readonly coreGetLangsService: CoreGetLangsService,
    ) {}

    async main()
    {
        return await this.coreGetLangsService.get();
    }
}