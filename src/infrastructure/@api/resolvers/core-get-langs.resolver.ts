import { Resolver, Query } from '@nestjs/graphql';
import { CoreGetLangsHandler } from '../handlers';

@Resolver()
export class CommonGetCountriesResolver
{
    constructor(
        private readonly handler: CoreGetLangsHandler,
    ) {}

    @Query('coreGetLangs')
    async main(): Promise<any[]>
    {
        return await this.handler.main();
    }
}