import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [
        // CqrsModule
    ],
    providers: [
        /*  {
            provide : ICriteria,
            useClass: SequelizeCriteria
        } */
    ],
    exports: [

    ]
})
export class CoreModule {}
