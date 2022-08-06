import { Module } from '@nestjs/common';

// prototypes
import './domain/shared/prototypes/array-remove-item.prototype';
import './domain/shared/prototypes/array-equals.prototype';

@Module({
    imports  : [],
    providers: [],
    exports  : [],
})
export class CoreModule {}
