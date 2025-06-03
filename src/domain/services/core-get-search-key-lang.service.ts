/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { CoreSearchKeyLang } from '../types';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class CoreGetSearchKeyLangService
{
    constructor(
        private readonly configService: ConfigService,
    ) {}

    get(): CoreSearchKeyLang
    {
        const appSearchKeyLang = this.configService.get('APP_SEARCH_KEY_LANG');

        if (!Object.values(CoreSearchKeyLang).includes(appSearchKeyLang))
        {
            Logger.warn('APP_SEARCH_KEY_LANG not found with correct value (iso6392 | iso6393 | ietf) default value iso6392, has been set');
            return CoreSearchKeyLang.ISO6392;
        }

        return appSearchKeyLang;
    }
}