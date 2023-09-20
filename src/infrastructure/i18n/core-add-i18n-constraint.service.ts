import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { CoreSearchKeyLang } from '../../domain/aurora.types';
import { QueryStatement } from '../../domain/persistence';

@Injectable()
export class CoreAddI18nConstraintService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    // method that adds the constraint of i18n to the query
    public async add(
        constraint: QueryStatement,
        i18NRelation: string,
        contentLanguage: string,
        {
            searchKeyLang = CoreSearchKeyLang.ISO6392,
            defineDefaultLanguage = true,
        }: {
            searchKeyLang?: CoreSearchKeyLang;
            defineDefaultLanguage?: boolean;

        } = {},
    ): Promise<QueryStatement>
    {
        const include = constraint.include || [];

        // if contentLanguage is *, return all languages records
        // value from content-language header
        if (contentLanguage === '*')
        {
            // if i18n relation is already included, don't include again
            if (!include.some(include => include.association === i18NRelation))
            {
                constraint.include = [
                    ...include,
                    {
                        association: i18NRelation,
                        required   : true,
                    },
                ];
            }

            return constraint;
        }

        // get langs from cache manager, previously
        // loaded in coreGetLangs service
        const langs: {
            id: string;
            iso6392: string;
            iso6393: string;
            ietf: string;
        }[] = await this.cacheManager.get('common/langs') || [];

        // try get lang from content-language header
        let lang = langs.find(lang => lang[searchKeyLang] === contentLanguage);

        // if lang is not defined, try get lang from APP_FALLBACK_LANG .env variable
        // to get object from this lang
        if (!lang && defineDefaultLanguage)
        {
            lang = langs.find(lang => lang[CoreSearchKeyLang.ISO6392] === this.configService.get<string>('APP_FALLBACK_LANG'));
        }

        // error if lang is not defined and should be defined default language APP_FALLBACK_LANG
        if (!lang && defineDefaultLanguage)
        {
            throw new InternalServerErrorException('APP_FALLBACK_LANG must be defined in iso6392 lang code format in .env file, not found contentLanguage: ', contentLanguage);
        }

        if (!include.some(include => include.association === i18NRelation))
        {
            constraint.include = [
                ...include,
                {
                    association: i18NRelation,
                    required   : true,
                    // add lang constrain if is defined
                    where      : lang ? { langId: lang.id } : undefined,
                },
            ];
        }

        return constraint;
    }
}
