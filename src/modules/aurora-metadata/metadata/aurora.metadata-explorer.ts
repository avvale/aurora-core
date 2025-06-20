import { Injectable, Logger } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { AuroraMetadataAccessor } from './aurora.metadata-accessor';
import { AuroraMetadataRegistry } from './aurora.metadata-registry';

/**
 * scans the providers and looks for aurora metadata,
 * if found it records it in the metadata registry
 */
@Injectable()
export class AuroraMetadataExplorer implements OnModuleInit
{
    private readonly logger = new Logger(AuroraMetadataRegistry.name);

    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: AuroraMetadataAccessor,
        private readonly metadataRegistry: AuroraMetadataRegistry,
    ) { }

    onModuleInit(): void
    {
        this.explore();
    }

    explore(): void
    {
        this.discoveryService
            .getProviders()
            .forEach((wrapper: InstanceWrapper) =>
            {
                const { instance } = wrapper;

                if (!instance || !Object.getPrototypeOf(instance))
                {
                    return;
                }

                this.lookupSchema(instance);
            });

        this.logger.log('Aurora metadata explorer successfully scanned providers', AuroraMetadataExplorer.name);
    }

    lookupSchema(instance): void
    {
        const metadata = this.metadataAccessor.getAuroraMetadata(instance);

        if (metadata)
        {
            this.metadataRegistry.addSchema(instance.constructor, metadata);
        }
    }
}
