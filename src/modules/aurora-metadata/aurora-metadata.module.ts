import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AuroraMetadataAccessor, AuroraMetadataExplorer, AuroraMetadataRegistry } from './metadata';

@Module({
    imports: [
        DiscoveryModule,
    ],
    providers: [
        AuroraMetadataAccessor,
        AuroraMetadataExplorer,
        AuroraMetadataRegistry,
    ],
    exports: [
        AuroraMetadataRegistry,
    ],
})
export class AuroraMetadataModule {}
