import { setSequelizeFunctions } from './set-sequelize-functions.function';
import { Sequelize } from 'sequelize-typescript';

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
});