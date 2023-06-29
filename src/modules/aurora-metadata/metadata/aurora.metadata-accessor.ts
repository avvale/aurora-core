import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AURORA_METADATA, AuroraMetadata } from '../decorators';

/**
 * examines the target (aurora constructor) and confirms if it has typesense
 * metadata if it does, returns the aurora object with its nested fields
 */
@Injectable()
export class AuroraMetadataAccessor
{
    constructor(
        private readonly reflector: Reflector,
    ) { }

    getAuroraMetadata(target): AuroraMetadata | undefined
    {
        if (target.constructor)
        {
            const auroraMetadata = this.reflector.get(AURORA_METADATA, target.constructor);

            if (!auroraMetadata)
            {
                return undefined;
            }

            return auroraMetadata;
        }

        return undefined;
    }
}
