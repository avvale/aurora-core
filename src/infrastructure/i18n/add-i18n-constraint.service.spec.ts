import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, CACHE_MANAGER } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AddI18nConstraintService } from './add-i18n-constraint.service';
import { FormatLangCode } from '../../domain/aurora.types';

const langs = [
    { id: '94c893c1-3eb7-4f22-a878-b405c6d42e09', name: 'Deutsch',   image: 'de', iso6392: 'de', iso6393: 'deu', ietf: 'de-DE', customCode: null, dir: 'RTL', sort: 0, isActive: false },
    { id: '7c4754e7-3363-48ca-af99-632522226b51', name: 'English',   image: 'gb', iso6392: 'en', iso6393: 'eng', ietf: 'en-US', customCode: null, dir: 'RTL', sort: 0, isActive: false },
    { id: '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a', name: 'Español',   image: 'es', iso6392: 'es', iso6393: 'spa', ietf: 'es-ES', customCode: null, dir: 'RTL', sort: 1, isActive: true  },
    { id: '47ecef11-3d7d-426b-967d-31f2f737b65c', name: 'Français',  image: 'fr', iso6392: 'fr', iso6393: 'fra', ietf: 'fr-FR', customCode: null, dir: 'RTL', sort: 0, isActive: false },
];

describe('AddI18nConstraintService', () =>
{
    let service: AddI18nConstraintService;

    beforeAll(async () =>
    {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CacheModule.register()
            ],
            providers: [
                AddI18nConstraintService,
                {
                    provide : CACHE_MANAGER,
                    useValue: {
                        get: (key: string) => key === 'common/langs' ? langs : null,
                    },
                },
                {
                    provide : ConfigService,
                    useValue: {
                        get: (key: string) => key === 'APP_LANG' ? 'es' : '',
                    },
                },
            ],
        }).compile();

        service = module.get<AddI18nConstraintService>(AddI18nConstraintService);
    });

    describe('main', () =>
    {
        test('AddI18nConstraintService should be defined', () =>
        {
            expect(service).toBeDefined();
        });

        test('should return a QueryStatement with uuid lang pass by parameter', async () =>
        {
            expect(await service.main({}, 'i18NRelation', '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a', { contentLanguageFormat: FormatLangCode.ID })).toEqual({
                include: [
                    {
                        association: 'i18NRelation',
                        required   : true,
                        where      : {
                            langId: '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a'
                        }
                    }
                ]
            });
        });

        test('should return a QueryStatement with iso6392 lang pass by parameter', async () =>
        {
            expect(await service.main({}, 'i18NRelation', 'es')).toEqual({
                include: [
                    {
                        association: 'i18NRelation',
                        required   : true,
                        where      : {
                            langId: '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a'
                        }
                    }
                ]
            });
        });

        test('should return a QueryStatement with iso6392 lang pass by parameter', async () =>
        {
            expect(await service.main({}, 'i18NRelation', 'en')).toEqual({
                include: [
                    {
                        association: 'i18NRelation',
                        required   : true,
                        where      : {
                            langId: '7c4754e7-3363-48ca-af99-632522226b51'
                        }
                    }
                ]
            });
        });

        test('should return a QueryStatement with undefined lang pass by parameter and take default lang', async () =>
        {
            expect(await service.main({}, 'i18NRelation', 'xx')).toEqual({
                include: [
                    {
                        association: 'i18NRelation',
                        required   : true,
                        where      : {
                            langId: '4470b5ab-9d57-4c9d-a68f-5bf8e32f543a'
                        }
                    }
                ]
            });
        });

        test('should return a QueryStatement without lang constraint', async () =>
        {
            expect(await service.main({}, 'i18NRelation', '*')).toEqual({
                include: [
                    {
                        association: 'i18NRelation',
                        required   : true,
                    }
                ]
            });
        });
    });
});