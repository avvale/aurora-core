import { Sequelize } from 'sequelize';
import { transformAttributes } from './set-sequelize-attributes-functions.function';

describe('transformAttributes', () =>
{
    it('transforms simple array aggregations and keeps other entries untouched', () =>
    {
        const attributes = [
            'modelId',
            { as: 'ids', col: 'id', fn: 'count' },
            ['name', 'newName'],
        ];

        const result = transformAttributes(attributes);

        expect(result).toEqual([
            'modelId',
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'ids'],
            ['name', 'newName'],
        ]);
    });

    it('transforms include aggregations inside attribute objects', () =>
    {
        const attributes = {
            include: [{ as: 'ids', col: 'id', fn: 'count' }],
            exclude: ['secretField'],
        };

        const result = transformAttributes(attributes);

        expect(result).toEqual({
            include: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'ids']],
            exclude: ['secretField'],
        });
    });

    it('supports COUNT DISTINCT over a column', () =>
    {
        const attributes = [{ as: 'uniqueUsers', col: 'userId', fn: 'count', distinct: true }];

        const result = transformAttributes(attributes);

        expect(result).toEqual([
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('userId'))), 'uniqueUsers'],
        ]);
    });

    it('supports functions with custom arguments', () =>
    {
        const attributes = [
            { as: 'nameOrNA', fn: 'coalesce', args: [{ col: 'name' }, 'N/A'] },
        ];

        const result = transformAttributes(attributes);

        expect(result).toEqual([
            [Sequelize.fn('COALESCE', Sequelize.col('name'), 'N/A'), 'nameOrNA'],
        ]);
    });

    it('wraps DISTINCT around the first argument when args array is provided', () =>
    {
        const attributes = [
            {
                as: 'distinctFullNameCount',
                fn: 'count',
                distinct: true,
                args: [
                    { fn: 'concat', args: [{ col: 'firstName' }, ' ', { col: 'lastName' }] },
                ],
            },
        ];

        const result = transformAttributes(attributes);

        expect(result).toEqual([
            [
                Sequelize.fn(
                    'COUNT',
                    Sequelize.fn(
                        'DISTINCT',
                        Sequelize.fn(
                            'CONCAT',
                            Sequelize.col('firstName'),
                            ' ',
                            Sequelize.col('lastName'),
                        ),
                    ),
                ),
                'distinctFullNameCount',
            ],
        ]);
    });

    it('returns input untouched when it is not an array or include object', () =>
    {
        const attributes = { raw: true };

        const result = transformAttributes(attributes);

        expect(result).toBe(attributes);
    });
});
