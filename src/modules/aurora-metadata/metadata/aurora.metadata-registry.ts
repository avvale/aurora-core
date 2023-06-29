import { Injectable, Logger } from '@nestjs/common';
import { AuroraMetadata } from '../decorators';

type Constructor = new (...args: any[]) => { /**/ };

/**
 * Storage modules information and manage them
 */
@Injectable()
export class AuroraMetadataRegistry
{
    private readonly logger = new Logger(AuroraMetadataRegistry.name);
    private auroraModules: Map<Constructor, AuroraMetadata> = new Map();

    addSchema(target: Constructor, auroraModule: AuroraMetadata): void
    {
        if (this.auroraModules.has(target))
        {
            this.logger.warn(`Schema ${target} already exists`);
        }

        this.auroraModules.set(target, auroraModule);
    }

    getSchemaByTarget(target: Constructor): AuroraMetadata | undefined
    {
        return this.auroraModules.get(target);
    }

    getSchemaByAggregateName(aggregateName: string): AuroraMetadata | undefined
    {
        for (const [key, value] of this.auroraModules)
        {
            if (value.boundedContextName.toPascalCase() + value.moduleName.toPascalCase() === aggregateName)
            {
                return value;
            }
        }
        return undefined;
    }

    getTargets(): IterableIterator<Constructor>
    {
        return this.auroraModules.keys();
    }
}
