import { setSequelizeFunctions } from './set-sequelize-functions.function';
import { Sequelize } from 'sequelize-typescript';
import { Op, Sequelize as SequelizeCore } from 'sequelize';

describe('setSequelizeFunctions', () =>
{
    const cQMetadata = { timezone: 'Europe/Madrid' };

    test('should return the same empty object', () => {
        expect(setSequelizeFunctions({}, cQMetadata)).toStrictEqual({});
    });

    test('should process object without function operator', () => {
        const input = {
            where: {
                name: 'John',
                age: 30,
            },
        };
        expect(setSequelizeFunctions(input, cQMetadata)).toEqual(input);
    });

    test('should apply timezone to timestamp values', () => {
        process.env.TZ = 'UTC';
        const input = {
            where: {
                name: 'John',
                age: 30,
                createdAt: '2023-01-01 12:00:00'
            },
        };

        const result = setSequelizeFunctions(input, cQMetadata);
        expect(result.where.createdAt).toBe('2023-01-01 11:00:00');
    });

    test('should keep timestamp without apply timezone', () => {
        process.env.TZ = 'UTC';
        const input = {
            where: {
                name: 'John',
                age: 30,
                'createdAt::timestamp': '2023-01-01 12:00:00'
            },
        };

        const result = setSequelizeFunctions(input, cQMetadata);
        expect(result.where.createdAt).toBe('2023-01-01 12:00:00');
    });

    test('should handle name::unaccent with primitive', () => {
        const input = {
            where: {
                'name::unaccent': 'Hello',
            },
        };

        const result: any = setSequelizeFunctions(input, cQMetadata);
        expect(result.where.name.attribute.fn).toBe('unaccent');
        expect(result.where.name.attribute.args[0].col).toBe('name');
        expect(result.where.name.logic.fn).toBe('unaccent');
        expect(result.where.name.logic.args[0]).toBe('Hello');
    });

    test('should handle cast on column', () => {
        const input = {
            where: {
                'age::cast::INTEGER': 18,
            },
        } as any;

        const result: any = setSequelizeFunctions(input, cQMetadata);
        // attribute is Cast object
        expect(result.where.age.attribute.type).toBe('INTEGER');
        expect(result.where.age.attribute.val.col).toBe('age');
        expect(result.where.age.logic).toBe(18);
    });

    test('should work within Op.or array combining multiple where(col(...))', () => {
        const input = {
            where: {
                [Op.or]: [
                    { 'name': { [Op.like]: '%carl%' } },
                    { '$Order.total$': { [Op.gt]: 500 } },
                ],
            },
        };

        const result: any = setSequelizeFunctions(input, cQMetadata);
        expect(Array.isArray(result.where[Op.or])).toBe(true);
        const [w1, w2] = result.where[Op.or];
        expect(w1).toEqual({ name: { [Op.like]: '%carl%' } });
        expect(w2).toEqual({ '$Order.total$': { [Op.gt]: 500 } });
    });

    test('should work within Op.or array combining multiple where(col(...))', () => {
        const input = {
            where: {
                [Op.or]: [
                    { 'name': { [Op.like]: '%carl%' } },
                    { '$territorial.country$::unaccent': { [Op.like]: '%Aragon%' } },
                ],
            },
        };

        const result: any = setSequelizeFunctions(input, cQMetadata);
        expect(Array.isArray(result.where[Op.or])).toBe(true);
        const [w1, w2] = result.where[Op.or];
        expect(w1).toEqual({ name: { [Op.like]: '%carl%' } });
        expect(w2['$territorial.country$'].attribute.fn).toBe('unaccent');
        expect(w2['$territorial.country$'].attribute.args[0].col).toBe('territorial.country');
        expect(w2['$territorial.country$'].logic[Op.like].fn).toBe('unaccent');
        expect(w2['$territorial.country$'].logic[Op.like].args[0]).toBe('%Aragon%');
    });
});
