/* eslint-disable @typescript-eslint/no-unused-vars */
declare interface String
{
    toSnakeCase(this: string): string;
}

// interface declared separate from your implementation to avoid error
// https://stackoverflow.com/questions/28779632/how-to-extend-string-prototype-when-importing-modules