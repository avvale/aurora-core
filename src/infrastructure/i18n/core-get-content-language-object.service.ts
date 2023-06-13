import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CoreGetSearchKeyLangService } from '../../domain';

@Injectable()
export class CoreGetContentLanguageObjectService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly coreGetSearchKeyLangService: CoreGetSearchKeyLangService,
    ) {}

    // method that adds the constraint of i18n to the query
    public async get(contentLanguage: string): Promise<{
        id: string;
        iso6392: string;
        iso6393: string;
        ietf: string;
    }>
    {
        // get langs from cache manager, previously
        // loaded in coreGetLangs service
        const langs: {
            id: string;
            iso6392: string;
            iso6393: string;
            ietf: string;
        }[] = await this.cacheManager.get('common/langs') || [];

        // try get lang from content-language header
        return langs.find(lang => lang[this.coreGetSearchKeyLangService.get()] === contentLanguage);
    }
}
