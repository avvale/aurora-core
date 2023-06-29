import { SetMetadata, applyDecorators } from '@nestjs/common';

export interface AuroraMetadata
{
    boundedContextName: string;
    moduleName: string;
    moduleNames: string;
}

export const AURORA_METADATA = '__auroraMetadata__';

export const Aurora = (options: AuroraMetadata): ClassDecorator =>
    applyDecorators((target: object, key?: any, descriptor?: any) =>
        SetMetadata(
            AURORA_METADATA,
            {
                boundedContextName: options.boundedContextName,
                moduleName        : options.moduleName,
                moduleNames       : options.moduleNames,
            },
        ) (target, key, descriptor),
    );
