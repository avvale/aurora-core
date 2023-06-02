import { CACHE_MANAGER, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { FormatLangCode } from '../../domain/aurora.types';
import { QueryStatement } from '../../domain/persistence';
import * as _ from 'lodash';

@Injectable()
export class AddI18nConstraintService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly configService: ConfigService,
    ) {}

    // method that adds the constraint of i18n to the query
    public async main(
        constraint: QueryStatement,
        i18NRelation: string,
        contentLanguage: string,
        {
            contentLanguageFormat = FormatLangCode.ISO6392,
            defineDefaultLanguage = true,
        }: {
            contentLanguageFormat?: FormatLangCode;
            defineDefaultLanguage?: boolean;

        } = {},
    ): Promise<QueryStatement>
    {
        // if contentLanguage is *, return all languages records
        if (contentLanguage === '*') return _.merge(
            {},
            {
                include: [{
                    association: i18NRelation,
                    required   : true,
                }],
            },
            constraint,
        );

        // get langs from cache manager, previous loaded in common module in onApplicationBootstrap hook
        const langs: {
            id: string;
            iso6392: string;
            iso6393: string;
            ietf: string;
        }[] = await this.cacheManager.get('common/langs') || [];

        let lang = langs.find(lang => lang[contentLanguageFormat] === contentLanguage);
        if (!lang && defineDefaultLanguage) lang = langs.find(lang => lang[FormatLangCode.ISO6392] === this.configService.get<string>('APP_LANG'));

        // error if lang is not defined
        if (!lang && defineDefaultLanguage) throw new InternalServerErrorException('APP_LANG must be defined in iso6392 lang code format in .env file, not found contentLanguage: ', contentLanguage);

        return _.merge(
            {},
            {
                include: [{
                    association: i18NRelation,
                    required   : true,
                    // add lang constrain if is defined
                    where      : lang ? { langId: lang.id } : undefined,
                }],
            },
            constraint,
        );
    }
}
