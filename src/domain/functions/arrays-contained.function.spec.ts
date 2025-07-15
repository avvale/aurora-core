import { arraysContained } from './arrays-contained.function';

describe('Arrays Contained', () =>
{
    beforeAll(async () =>
    {
        /**/
    });

    describe('main', () =>
    {
        test('Utils array overlap has alls elements', () =>
        {
            const arrA = [1, 2, 3];
            const arrB = [1, 2, 3, 4, 5, 6];

            expect(arraysContained(arrA, arrB)).toBe(true);
        });

        test('Utils array overlap has one element', () =>
        {
            const arrA = [1, 6, 6];
            const arrB = [1, 2, 3, 4, 5, 6];

            expect(arraysContained(arrA, arrB)).toBe(true);
        });

        test('Utils array overlap hasn\'t any element', () =>
        {
            const arrA = [1, 2, 3, 4, 5, 6, 7];
            const arrB = [1, 2, 3, 4, 5, 6];

            expect(arraysContained(arrA, arrB)).toBe(false);
        });
    });
});