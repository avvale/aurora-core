import { arraysIntersects } from './arrays-intersects.function';

describe('Arrays Intersects', () =>
{
    beforeAll(async () =>
    {
        /**/
    });

    describe('main', () =>
    {
        test('Utils array intersects has alls elements', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [1, 2, 4];

            expect(arraysIntersects(arrA, arrB)).toBe(true);
        });

        test('Utils array intersects has one element', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [1, 8, 18];

            expect(arraysIntersects(arrA, arrB)).toBe(true);
        });

        test('Utils array intersects hasn\'t any element', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [9, 8, 8, 18];

            expect(arraysIntersects(arrA, arrB)).toBe(false);
        });
    });
});