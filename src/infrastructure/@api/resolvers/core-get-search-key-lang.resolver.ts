/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Resolver, Query } from '@nestjs/graphql';
import { CoreGetSearchKeyLangHandler } from '../handlers';

@Resolver()
export class CoreGetSearchKeyLangResolver
{
    constructor(
        private readonly handler: CoreGetSearchKeyLangHandler,
    ) {}

    @Query('coreGetSearchKeyLang')
    async main()
    {
        return await this.handler.main();
    }
}