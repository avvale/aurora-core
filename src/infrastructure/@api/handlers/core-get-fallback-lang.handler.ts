/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CoreGetFallbackLangHandler
{
    constructor(
        private readonly configService: ConfigService,
    ) {}

    main(): string
    {
        return this.configService.get('APP_FALLBACK_LANG');
    }
}