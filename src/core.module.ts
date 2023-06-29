import { Module } from '@nestjs/common';

// prototypes
import './domain/prototypes/array-remove-item.interface';
import './domain/prototypes/array-remove-item.prototype';
import './domain/prototypes/string-to-camel-case.interface';
import './domain/prototypes/string-to-camel-case';
import './domain/prototypes/string-to-kebab-case.interface';
import './domain/prototypes/string-to-kebab-case';
import './domain/prototypes/string-to-pascal-case.interface';
import './domain/prototypes/string-to-pascal-case';
import './domain/prototypes/string-to-snake-case.interface';
import './domain/prototypes/string-to-snake-case';

@Module({
    imports  : [],
    providers: [],
    exports  : [],
})
export class CoreModule {}
