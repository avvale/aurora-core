import { Utils } from './utils';
// import './domain/shared/prototypes/array-equals.prototype';

describe('Utils', () =>
{
    beforeAll(async () =>
    {
        /**/
    });

    describe('main', () =>
    {
        test('Utils get diff simple object', () =>
        {
            const newObj = { a: 1, b: 2, c: 3 };
            const origObj = { a: 1, b: 2, c: 4 };

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3 });
        });

        test('Utils get diff object with simple array', () =>
        {
            const newObj = { a: 1, b: 2, c: 3, d: [1, 2, 3]};
            const origObj = { a: 1, b: 2, c: 4, d: [1, 2, 4]};

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3, d: [3]});
        });

        test('Utils get diff object with object\'s array', () =>
        {
            const newObj = { a: 1, b: 2, c: 3, d: [{ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }]};
            const origObj = { a: 1, b: 2, c: 4, d: [{ a: 1, b: 2, c: 3 }, { a: 1, b: 4, c: 3 }]};

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3, d: [{ b: 2 }]});
        });

        test('Utils get diff simple object with extra properties', () =>
        {
            const newObj = { a: 1, b: 2, c: 3 };
            const origObj = { a: 1, b: 2, c: 4, d: 5, e: 6 };

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3 });
        });

        test('Utils get diff object with simple array with extra properties', () =>
        {
            const newObj = { a: 1, b: 2, c: 3, d: [1, 2, 3]};
            const origObj = { a: 1, b: 2, c: 4, d: [1, 2, 4, 5, 6], e: 5, f: 6 };

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3, d: [3]});
        });

        test('Utils get diff object with object\'s array', () =>
        {
            const newObj = { a: 1, b: 2, c: 3, d: [{ a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 2, c: 3, d: 4 }]};
            const origObj = { a: 1, b: 2, c: 4, d: [{ a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 4, c: 3, d: 4 }], e: 5, f: 6 };

            expect(Utils.diff(newObj, origObj)).toStrictEqual({ c: 3, d: [{ b: 2 }]});
        });

        test('Utils get diff simple array', () =>
        {
            const newObj = [{ a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 2, c: 3, d: 4 }];
            const origObj = [{ a: 1, b: 2, c: 3, d: 4 }, { a: 1, b: 4, c: 3, d: 4 }];

            expect(Utils.diff(newObj, origObj)).toStrictEqual([{ b: 2 }]);
        });

        test('Utils get diff object\'s array', () =>
        {
            const newObj = [1, 2, 3];
            const origObj = [1, 2, 4];

            expect(Utils.diff(newObj, origObj)).toStrictEqual([3]);
        });

        test('Utils array intersects has alls elements', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [1, 2, 4];

            expect(Utils.arraysIntersects(arrA, arrB)).toBe(true);
        });

        test('Utils array intersects has one element', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [1, 8, 18];

            expect(Utils.arraysIntersects(arrA, arrB)).toBe(true);
        });

        test('Utils array intersects hasn\'t any element', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [9, 8, 8, 18];

            expect(Utils.arraysIntersects(arrA, arrB)).toBe(false);
        });
    });
});