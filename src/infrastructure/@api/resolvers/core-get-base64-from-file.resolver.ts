/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Resolver, Query, Args } from '@nestjs/graphql';
import { CoreGetBase64FromFileHandler } from '../handlers';

@Resolver()
export class CoreGetBase64FromFileResolver
{
    constructor(
        private readonly handler: CoreGetBase64FromFileHandler,
    ) {}

    @Query('coreGetBase64FromFile')
    async main(
        @Args('relativePathSegments') relativePathSegments: string[],
        @Args('filename') filename: string,
    )
    {
        return await this.handler.main(
            relativePathSegments,
            filename,
        );
    }
}
